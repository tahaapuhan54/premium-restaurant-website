'use client';

import { motion } from 'framer-motion';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { fadeUp, stagger } from '@/lib/motion';
import { TESTIMONIALS } from '@/lib/content';

function Quote() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 text-ember/60" fill="currentColor" aria-hidden>
      <path d="M9.5 6C6.5 7.5 5 10 5 13v5h6v-6H8c0-2 .8-3.4 2.4-4.3L9.5 6zm9 0c-3 1.5-4.5 4-4.5 7v5h6v-6h-3c0-2 .8-3.4 2.4-4.3L18.5 6z" />
    </svg>
  );
}

export default function Testimonials() {
  return (
    <section className="relative border-y border-gold/10 bg-char-900/40 py-28 lg:py-36">
      <div className="mx-auto max-w-container px-5 sm:px-8">
        <SectionHeading
          align="center"
          kicker="Sözler"
          title="Sofradan yükselenler"
          italicWord="yükselenler"
          className="mx-auto mb-16"
        />

        <motion.div
          variants={stagger(0, 0.15)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 lg:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.figure
              key={t.name}
              variants={fadeUp}
              className="flex h-full flex-col rounded-[3px] border border-gold/[0.06] bg-char-800/40 p-8 transition-colors duration-300 hover:border-gold/20"
            >
              <Quote />
              <blockquote className="mt-5 flex-1 font-display text-lg font-light italic leading-relaxed text-cream/70">
                {t.quote}
              </blockquote>
              <figcaption className="mt-7 border-t border-gold/[0.08] pt-5">
                <p className="font-body font-semibold text-cream">{t.name}</p>
                <p className="font-body text-xs uppercase tracking-[0.14em] text-ash">{t.role}</p>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>

        <Reveal delay={0.1} className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-ash">
          <span className="font-body text-xs uppercase tracking-[0.24em]">Michelin Rehberi’nde önerilen</span>
          <span className="h-3 w-px bg-gold/25" />
          <span className="font-body text-xs uppercase tracking-[0.24em]">Time Out Istanbul · 2024</span>
          <span className="h-3 w-px bg-gold/25" />
          <span className="font-body text-xs uppercase tracking-[0.24em]">Gault&Millau · 3 Toque</span>
        </Reveal>
      </div>
    </section>
  );
}
