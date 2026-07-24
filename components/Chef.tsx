'use client';

import Image from 'next/image';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';

export default function Chef() {
  return (
    <section id="chef" className="relative overflow-hidden py-28 lg:py-36">
      {/* Ambient ember glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-ember/10 blur-[130px]"
      />

      <div className="mx-auto grid max-w-container items-center gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* Portrait */}
        <Reveal className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2px]">
            <Image
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1000&q=80"
              alt="KÖZ’ün baş şefi Emre Solak, ocakbaşında"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-char-950/70 to-transparent" />
            <div className="absolute inset-0 ring-1 ring-inset ring-gold/15" />
          </div>
          <p className="absolute bottom-5 left-5 font-display text-2xl italic text-cream">
            Emre Solak
            <span className="mt-1 block font-body text-[0.65rem] uppercase tracking-[0.24em] text-gold not-italic">
              Baş Şef & Ateş Ustası
            </span>
          </p>
        </Reveal>

        {/* Words */}
        <div>
          <SectionHeading kicker="Mutfağın Ardında" title="Ateşi okuyan eller" italicWord="okuyan" />

          <Reveal delay={0.1}>
            <blockquote className="mt-8 max-w-xl">
              <p className="font-display text-2xl font-light italic leading-snug text-cream/75 sm:text-3xl">
                “İyi et konuşmaz; onu dinlemeniz gerekir. Ateş ne zaman geri çekileceğini
                bilirseniz, gerisi kendiliğinden gelir.”
              </p>
            </blockquote>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-8 max-w-xl text-balance leading-relaxed text-cream/58">
              Emre, Gaziantep’in ocak kültüründen İstanbul’un fine-dining mutfaklarına uzanan
              yirmi yıllık bir yolun ardından KÖZ’ü kurdu. Her akşam ocağın başında durur;
              menüyü değil, o günün etini ve ateşin ruh hâlini takip eder.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-wrap gap-x-10 gap-y-4">
              {[
                ['20+', 'yıllık mutfak'],
                ['Gaziantep', 'ocak kökeni'],
                ['Tek', 'değişmez ilke: ateş'],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="font-display text-2xl text-gilt">{v}</p>
                  <p className="font-body text-xs uppercase tracking-[0.16em] text-ash">{l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
