'use client';

import { useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import Reveal from './Reveal';
import { STORY } from '@/lib/content';
import { lineGrow, viewportOnce } from '@/lib/motion';

// A single wide halo drifting behind the cursor. Overdamped (ratio > 1), so it
// glides into place and never wobbles — that is what reads as smooth.
const HALO_SPRING = { stiffness: 45, damping: 26, mass: 0.8 };
const FADE_SPRING = { stiffness: 30, damping: 22 };

export default function Story() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Pointer position inside the section, in px.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const haloX = useSpring(pointerX, HALO_SPRING);
  const haloY = useSpring(pointerY, HALO_SPRING);

  const lit = useMotionValue(0);
  const opacity = useSpring(lit, FADE_SPRING);

  // The section's offset is cached instead of measured per mousemove: reading a
  // rect mid-move forces a synchronous layout on a frame that is already busy,
  // which is exactly what makes a cursor effect feel like it is stuttering.
  const origin = useRef<{ left: number; top: number } | null>(null);
  const hovering = useRef(false);

  const measure = useCallback(() => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (rect) origin.current = { left: rect.left, top: rect.top };
  }, []);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const o = origin.current;
      if (!o) return;
      pointerX.set(e.clientX - o.left);
      pointerY.set(e.clientY - o.top);
    },
    [pointerX, pointerY],
  );

  const handleEnter = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      hovering.current = true;
      measure();
      const o = origin.current;
      if (!o) return;
      // Seat the halo where the cursor entered, so it never sweeps in from 0,0.
      const x = e.clientX - o.left;
      const y = e.clientY - o.top;
      for (const value of [pointerX, haloX]) value.jump(x);
      for (const value of [pointerY, haloY]) value.jump(y);
      lit.set(1);
    },
    [haloX, haloY, lit, measure, pointerX, pointerY],
  );

  const handleLeave = useCallback(() => {
    hovering.current = false;
    lit.set(0);
  }, [lit]);

  // Re-measure only while the pointer is inside, and at most once per frame.
  useEffect(() => {
    let frame: number | null = null;
    const refresh = () => {
      if (!hovering.current || frame !== null) return;
      frame = requestAnimationFrame(() => {
        frame = null;
        measure();
      });
    };
    window.addEventListener('scroll', refresh, { passive: true });
    window.addEventListener('resize', refresh);
    return () => {
      window.removeEventListener('scroll', refresh);
      window.removeEventListener('resize', refresh);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [measure]);

  return (
    <section
      ref={sectionRef}
      id="story"
      onMouseMove={reduce ? undefined : handleMove}
      onMouseEnter={reduce ? undefined : handleEnter}
      onMouseLeave={reduce ? undefined : handleLeave}
      className="group/story relative overflow-hidden py-28 lg:py-40"
    >
      {/* Cursor light — a single wide halo drifting behind the pointer */}
      {!reduce && (
        <motion.div aria-hidden style={{ opacity }} className="pointer-events-none absolute inset-0">
          <motion.div
            style={{ x: haloX, y: haloY }}
            className="cursor-halo absolute left-0 top-0 -ml-56 -mt-56 h-112 w-112 rounded-full will-change-transform"
          />
        </motion.div>
      )}

      <div className="relative mx-auto grid max-w-container items-start gap-14 px-5 sm:px-8 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
        {/* Left rail — eyebrow + oversized display heading */}
        <div>
          <Reveal>
            <span className="eyebrow mb-7">{STORY.kicker}</span>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="font-display text-5xl uppercase leading-[0.94] tracking-[0.01em] text-cream sm:text-6xl lg:text-[4.1rem]">
              {STORY.titleLead}
              <span className="text-gilt mt-2 block italic">{STORY.titleAccent}</span>
            </h2>
          </Reveal>
        </div>

        {/* Right column — lead, hairline, body, pull quote */}
        <div className="lg:pt-2">
          <Reveal delay={0.12}>
            <p className="max-w-2xl font-display text-2xl font-light leading-[1.5] text-cream/85 transition-colors duration-700 ease-luxe group-hover/story:text-cream sm:text-3xl sm:leading-[1.45]">
              {STORY.lead}
            </p>
          </Reveal>

          {/* Draws itself in on view, then lengthens while the section is hovered */}
          <motion.div
            aria-hidden
            variants={reduce ? undefined : lineGrow}
            initial={reduce ? undefined : 'hidden'}
            whileInView={reduce ? undefined : 'show'}
            viewport={viewportOnce}
            className="my-10 h-px w-20 origin-left bg-gold/35 transition-[width,background-color] duration-700 ease-luxe group-hover/story:w-32 group-hover/story:bg-gold/60"
          />

          <Reveal delay={0.22}>
            <p className="max-w-xl leading-[1.9] text-cream/55 transition-colors duration-700 ease-luxe group-hover/story:text-cream/70">
              {STORY.bodyBefore}
              <span className="relative inline-block cursor-default text-gold-light/85 transition-colors duration-500 ease-luxe after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-right after:scale-x-0 after:bg-gold-light/50 after:transition-transform after:duration-500 after:ease-luxe after:content-[''] hover:text-gold-light hover:after:origin-left hover:after:scale-x-100">
                {STORY.bodyName}
              </span>
              {STORY.bodyAfter}
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <blockquote className="mt-14 max-w-2xl">
              <p className="text-gilt-sweep w-fit font-display text-2xl font-light italic leading-snug sm:text-[2rem]">
                {STORY.quote}
              </p>
              <footer className="mt-4 font-body text-[0.65rem] uppercase tracking-[0.24em] text-ash/70 transition-colors duration-700 ease-luxe group-hover/story:text-ash">
                {STORY.attribution}
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
