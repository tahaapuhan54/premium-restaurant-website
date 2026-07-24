'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * A field of slowly rising embers rendered with pure CSS animation.
 * Deterministic positions (seeded) so SSR and client markup match.
 * Disabled entirely for reduced-motion users.
 *
 * When `parallax` is set, the whole field eases toward the cursor for a
 * sense of depth — the coals seem to lean as the pointer moves. The follow
 * is driven by a requestAnimationFrame lerp writing the transform directly.
 */
export default function Embers({
  count = 26,
  parallax = false,
  strength = 26,
}: {
  count?: number;
  parallax?: boolean;
  /** Max px the field shifts toward the cursor. */
  strength?: number;
}) {
  const reduce = useReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  const sparks = useMemo(() => {
    // Simple seeded pseudo-random for stable hydration.
    let seed = 7;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    return Array.from({ length: count }, () => ({
      left: rand() * 100,
      size: 1.5 + rand() * 3,
      delay: rand() * 9,
      duration: 7 + rand() * 8,
      drift: (rand() - 0.5) * 40,
      opacity: 0.3 + rand() * 0.6,
    }));
  }, [count]);

  useEffect(() => {
    if (!parallax || reduce) return;
    const layer = layerRef.current;
    if (!layer) return;

    const onMove = (e: MouseEvent) => {
      // Measure the section, not the layer — the layer is the thing we move.
      const r = (layer.parentElement ?? layer).getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2 || 1);
      const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2 || 1);
      target.current.x = Math.max(-1, Math.min(1, nx)) * strength;
      target.current.y = Math.max(-1, Math.min(1, ny)) * strength;
    };

    let raf = 0;
    const tick = () => {
      // Ease the current offset toward the target — weighty, fire-like follow.
      current.current.x += (target.current.x - current.current.x) * 0.06;
      current.current.y += (target.current.y - current.current.y) * 0.06;
      layer.style.transform = `translate3d(${current.current.x.toFixed(2)}px, ${current.current.y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, [parallax, reduce, strength]);

  if (reduce) return null;

  return (
    <div
      ref={layerRef}
      aria-hidden
      className={`pointer-events-none absolute overflow-hidden will-change-transform ${
        parallax ? '-inset-16' : 'inset-0'
      }`}
    >
      {sparks.map((s, i) => (
        <span
          key={i}
          className="absolute bottom-[-10%] rounded-full"
          style={{
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background:
              'radial-gradient(circle, rgba(224,123,60,1) 0%, rgba(200,99,46,0.7) 45%, rgba(200,99,46,0) 75%)',
            boxShadow: '0 0 6px rgba(224,123,60,0.8)',
            // @ts-expect-error custom property for keyframe drift
            '--drift': `${s.drift}px`,
            animation: `ember-rise ${s.duration}s ${s.delay}s ease-in infinite`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}
