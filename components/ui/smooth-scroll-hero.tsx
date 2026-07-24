'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import {
  HERO_SCROLL_LENGTH,
  pickHeroQuality,
  strideFrames,
  type HeroQuality,
} from '@/lib/hero';
import {
  FrameSequence,
  frameSize,
  readFrameSequence,
  type DecodedFrame,
} from '@/lib/frame-sequence';

/**
 * One spring drives the whole reveal — clip, zoom, fade and the still that is
 * showing all read from it, so nothing can drift out of sync. Soft enough that a
 * notched wheel tick glides instead of stepping.
 */
const REVEAL_SPRING = { stiffness: 110, damping: 32, mass: 0.4, restDelta: 0.0005 } as const;
/** Retina sharpness without the fill cost. */
const MAX_DPR = 2;
/** The stills are 1280 wide; a backing store past this only burns fill rate. */
const MAX_CANVAS_WIDTH = 1600;

interface SmoothScrollHeroProps {
  /** Ordered frame URLs; the wheel position picks exactly one of them. */
  frames: readonly string[];
  /**
   * Initial (closed) clip window, in %.
   * @default 25
   */
  initialClipPercentage?: number;
  /**
   * Final (open) clip window before it fills the screen, in %.
   * @default 75
   */
  finalClipPercentage?: number;
  /**
   * Maximum pointer drift of the frames, in px.
   * @default 20
   */
  mouseStrength?: number;
  /** Content pinned over the reveal (wordmark, CTAs, etc.). */
  children?: React.ReactNode;
}

/**
 * True once the page has finished loading and the main thread has gone quiet.
 *
 * Keeps the decoder off the server, and — more importantly — keeps the sequence
 * from starting while the page is still painting. Priming pulls well over a
 * megabyte of stills; started at hydration it competes with the hero's own
 * first paint for bandwidth and decode time. Nobody has scrolled yet at that
 * point, so the wait is free: the poster is already covering the reveal.
 */
function useIdle(): boolean {
  const [idle, setIdle] = React.useState(false);

  React.useEffect(() => {
    let timer = 0;
    let idleHandle = 0;

    const begin = () => {
      // Safari only picked up requestIdleCallback recently — a short timeout is
      // the same intent where it is missing.
      if (typeof requestIdleCallback === 'function') {
        idleHandle = requestIdleCallback(() => setIdle(true), { timeout: 2000 });
      } else {
        timer = window.setTimeout(() => setIdle(true), 200);
      }
    };

    if (document.readyState === 'complete') {
      begin();
      return () => {
        if (timer) clearTimeout(timer);
        if (idleHandle) cancelIdleCallback(idleHandle);
      };
    }

    window.addEventListener('load', begin, { once: true });
    return () => {
      window.removeEventListener('load', begin);
      if (timer) clearTimeout(timer);
      if (idleHandle) cancelIdleCallback(idleHandle);
    };
  }, []);

  return idle;
}

/**
 * Paints the still picked by `progress` (0 -> 1) onto a canvas, cover-fitted.
 *
 * Suspends until the sequence is primed, so this only ever mounts with something
 * to draw. A single rAF loop — running only while the hero is on screen — reads
 * the spring, moves the decode window and repaints when the resolved still
 * actually changes, which most scroll deltas do not.
 */
function FrameSequenceCanvas({
  frames,
  quality,
  progress,
  onFirstPaint,
}: {
  frames: string[];
  quality: HeroQuality;
  progress: MotionValue<number>;
  onFirstPaint: () => void;
}) {
  const sequence = readFrameSequence(
    `${frames.length}@${quality.decodeWidth}:${frames[0]}`,
    () => new FrameSequence(frames, quality),
  );
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    // The stills are fully opaque, so an alpha-less context composites faster for free.
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;
    ctx.imageSmoothingQuality = 'high';

    let painted: DecodedFrame | null = null;
    let lastIndex = -1;
    let raf = 0;
    let announced = false;

    const paint = (frame: DecodedFrame) => {
      const { width: sw, height: sh } = frameSize(frame);
      const cw = canvas.width;
      const ch = canvas.height;
      if (!sw || !sh || !cw || !ch) return;

      const scale = Math.max(cw / sw, ch / sh);
      const dw = sw * scale;
      const dh = sh * scale;
      ctx.drawImage(frame, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      painted = frame;

      if (!announced) {
        announced = true;
        onFirstPaint();
      }
    };

    // Layout size, not `getBoundingClientRect` — the layer above this canvas is
    // scaled, and measuring through that transform inflates the backing store.
    const applySize = () => {
      const cssWidth = canvas.clientWidth;
      const cssHeight = canvas.clientHeight;
      if (!cssWidth || !cssHeight) return;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const width = Math.min(Math.round(cssWidth * dpr), MAX_CANVAS_WIDTH);
      const height = Math.max(1, Math.round(width * (cssHeight / cssWidth)));
      if (canvas.width === width && canvas.height === height) return;

      canvas.width = width;
      canvas.height = height;
      ctx.imageSmoothingQuality = 'high';

      // Resizing clears the bitmap — repaint whatever was showing.
      const previous = painted;
      painted = null;
      if (previous) paint(previous);
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);

      const p = Math.min(Math.max(progress.get(), 0), 1);
      const index = Math.round(p * (sequence.length - 1));
      if (index !== lastIndex) {
        lastIndex = index;
        sequence.setPlayhead(index);
      }

      const frame = sequence.frameAt(index);
      if (frame && frame !== painted) paint(frame);
    };

    const resizeObserver = new ResizeObserver(applySize);
    resizeObserver.observe(canvas);
    applySize();

    // Off screen there is nothing to scrub — stop the loop so the rest of the
    // page scrolls against an idle main thread.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !raf) raf = requestAnimationFrame(tick);
        else if (!entry.isIntersecting && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: '15% 0px' },
    );
    visibility.observe(canvas);

    raf = requestAnimationFrame(tick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibility.disconnect();
      sequence.release();
    };
  }, [sequence, progress, onFirstPaint]);

  return <canvas ref={canvasRef} className="block h-full w-full" aria-hidden />;
}

/**
 * The still the reveal opens on. It is the LCP image: preloaded, optimised and
 * on screen before a single sequence byte lands, so the hero is never empty.
 */
function HeroPoster({ src, retired = false }: { src: string; retired?: boolean }) {
  return (
    <Image
      src={src}
      alt=""
      fill
      priority
      sizes="100vw"
      aria-hidden
      // Only steps aside once the canvas above has finished fading in — dropping
      // both at once would show the background through the crossfade.
      className={`object-cover object-center transition-opacity delay-1000 duration-500 ${
        retired ? 'opacity-0' : 'opacity-100'
      }`}
    />
  );
}

/** Poster underneath, canvas on top, cross-faded once the first still is drawn. */
function RevealLayer({
  frames,
  progress,
}: {
  frames: readonly string[];
  progress: MotionValue<number>;
}) {
  const ready = useIdle();
  const [live, setLive] = React.useState(false);
  const handleFirstPaint = React.useCallback(() => setLive(true), []);

  const quality = React.useMemo(() => pickHeroQuality(), []);
  const strided = React.useMemo(() => strideFrames(frames, quality.stride), [frames, quality]);

  return (
    <>
      <HeroPoster src={frames[0]} retired={live} />
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          live ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <React.Suspense fallback={null}>
          {ready ? (
            <FrameSequenceCanvas
              frames={strided}
              quality={quality}
              progress={progress}
              onFirstPaint={handleFirstPaint}
            />
          ) : null}
        </React.Suspense>
      </div>
    </>
  );
}

/** The sticky, shutter-revealing, mouse-reactive frame layer. */
function SmoothScrollHeroBackground({
  frames,
  initialClipPercentage,
  finalClipPercentage,
  mouseStrength,
  children,
}: Required<Omit<SmoothScrollHeroProps, 'children'>> & { children?: React.ReactNode }) {
  const { scrollY } = useScroll();

  // The wheel drives the timeline: wheeling down runs the sequence forward,
  // wheeling back up rewinds it, still by still. Nothing advances on its own.
  const raw = useTransform(scrollY, [0, HERO_SCROLL_LENGTH], [0, 1]);
  const reveal = useSpring(raw, REVEAL_SPRING);

  // Expanding centred window -> full screen. Driven by four opaque panels sliding
  // outward rather than an animated `clip-path`: clip-path is not a compositor
  // property, so animating it repainted the whole frame layer — canvas, gradients
  // and all — on every scroll frame. Sliding solid panels is transforms only.
  const shutterOpen = useTransform(reveal, [0, 1], [`-${100 - initialClipPercentage}%`, '-100%']);
  const shutterClose = useTransform(reveal, [0, 1], [`${finalClipPercentage}%`, '100%']);

  // Slow zoom-out as the reveal opens.
  const scale = useTransform(reveal, [0, 1], [1.7, 1.08]);

  // Fade the pinned content out as the reveal completes.
  const contentOpacity = useTransform(reveal, [0, 0.65, 1], [1, 1, 0]);

  // Pointer parallax, spring-smoothed so the frames always glide.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const drift = { stiffness: 55, damping: 18, mass: 0.6 };
  const sx = useSpring(px, drift);
  const sy = useSpring(py, drift);
  const mouseX = useTransform(sx, [-0.5, 0.5], [mouseStrength, -mouseStrength]);
  const mouseY = useTransform(sy, [-0.5, 0.5], [mouseStrength, -mouseStrength]);

  const handleMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // The sticky layer is pinned to the viewport, so its box is the viewport —
      // measuring it here would force a synchronous layout on every mousemove.
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    },
    [px, py],
  );

  const handleLeave = React.useCallback(() => {
    px.set(0);
    py.set(0);
  }, [px, py]);

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="sticky top-0 h-svh w-full overflow-hidden bg-char-950"
    >
      {/* Zooming, pointer-drifting frame sequence */}
      <motion.div
        style={{ scale, x: mouseX, y: mouseY }}
        className="absolute inset-0 will-change-transform"
      >
        <RevealLayer frames={frames} progress={reveal} />
      </motion.div>

      {/* Cinematic tone — static now, so it is painted once and only composited */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-char-950/55 via-char-950/35 to-char-950" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_35%,transparent_0%,rgba(11,9,8,0.7)_100%)]" />

      {/* The shutter: four solid panels that slide off to open the window */}
      <motion.div
        style={{ y: shutterOpen }}
        className="pointer-events-none absolute inset-x-0 top-0 h-full bg-char-950 will-change-transform"
      />
      <motion.div
        style={{ y: shutterClose }}
        className="pointer-events-none absolute inset-x-0 top-0 h-full bg-char-950 will-change-transform"
      />
      <motion.div
        style={{ x: shutterOpen }}
        className="pointer-events-none absolute inset-y-0 left-0 w-full bg-char-950 will-change-transform"
      />
      <motion.div
        style={{ x: shutterClose }}
        className="pointer-events-none absolute inset-y-0 left-0 w-full bg-char-950 will-change-transform"
      />

      {/* Pinned content, unaffected by the clip */}
      {children ? (
        <motion.div style={{ opacity: contentOpacity }} className="absolute inset-0 z-10">
          {children}
        </motion.div>
      ) : null}
    </div>
  );
}

/** Static, reduced-motion fallback: the opening still, no dead scroll, no decoding. */
function StaticHero({
  frames,
  children,
}: {
  frames: readonly string[];
  children?: React.ReactNode;
}) {
  return (
    <div className="relative h-svh min-h-[640px] w-full overflow-hidden bg-char-950">
      <HeroPoster src={frames[0]} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-char-950/55 via-char-950/35 to-char-950" />
      {children ? <div className="absolute inset-0 z-10">{children}</div> : null}
    </div>
  );
}

/**
 * A smooth-scroll hero: a full-bleed frame sequence revealed through an expanding
 * shutter window as you scroll, zooming out and drifting with the pointer. Nothing
 * plays on its own — the mouse wheel scrubs the sequence, wheeling down for forward and
 * back up to rewind, one decoded still per frame. Content passed as children is pinned
 * over the reveal. Honours `prefers-reduced-motion`.
 *
 * The scroll length is the `HERO_SCROLL_LENGTH` token: the `h-hero-scroll` utility and
 * the transforms below are generated from the same number.
 */
export default function SmoothScrollHero({
  frames,
  initialClipPercentage = 25,
  finalClipPercentage = 75,
  mouseStrength = 20,
  children,
}: SmoothScrollHeroProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <StaticHero frames={frames}>{children}</StaticHero>;
  }

  return (
    <div className="relative h-hero-scroll w-full">
      <SmoothScrollHeroBackground
        frames={frames}
        initialClipPercentage={initialClipPercentage}
        finalClipPercentage={finalClipPercentage}
        mouseStrength={mouseStrength}
      >
        {children}
      </SmoothScrollHeroBackground>
    </div>
  );
}
