'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { fadeUp, stagger } from '@/lib/motion';
import { SIGNATURE } from '@/lib/content';

export default function Signature() {
  return (
    <section id="signature" className="relative border-y border-gold/10 bg-char-900/40 py-28 lg:py-36">
      <div className="mx-auto max-w-container px-5 sm:px-8">
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading kicker="İmza Etler" title="Közün başrolleri" italicWord="başrolleri" />
          <Reveal delay={0.15}>
            <p className="max-w-sm text-balance text-cream/58">
              Üç kesim, üç karakter. Her biri farklı bir dinlendirme ve ateş hikâyesi taşır.
            </p>
          </Reveal>
        </div>

        <motion.div
          variants={stagger(0, 0.14)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {SIGNATURE.map((cut) => (
            <motion.article
              key={cut.name}
              variants={fadeUp}
              className="group relative flex flex-col overflow-hidden rounded-[3px] border border-gold/[0.06] bg-char-800/60 transition-colors duration-300 hover:border-gold/20"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={cut.img}
                  alt={`${cut.name} — ${cut.note}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-char-900 via-char-900/20 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full border border-gold/30 bg-char-950/70 px-3 py-1 font-body text-[0.65rem] uppercase tracking-[0.2em] text-gold backdrop-blur-sm">
                  {cut.aged}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-2xl text-cream">{cut.name}</h3>
                  <span className="font-display text-xl text-gilt">
                    <span className="text-sm text-ash">₺</span>
                    {cut.price}
                  </span>
                </div>
                <p className="mt-1 font-body text-xs uppercase tracking-[0.16em] text-ember/90">
                  {cut.weight}
                </p>
                <p className="mt-4 text-balance text-sm leading-relaxed text-cream/58">{cut.note}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
