'use client';

import Reveal from './Reveal';
import { LOCATION } from '@/lib/content';

export default function Location() {
  return (
    <section id="visit" className="mx-auto max-w-container px-5 py-28 sm:px-8 lg:py-32">
      <Reveal>
        <span className="eyebrow mb-6">{LOCATION.kicker}</span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-display text-4xl font-medium uppercase leading-[1.04] tracking-[0.015em] text-cream sm:text-5xl lg:text-[3.75rem]">
          {LOCATION.place}
          <br />
          <span className="text-gilt italic">{LOCATION.city}</span>
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
        {/* Address */}
        <Reveal className="flex flex-col">
          <p className="font-body text-[0.7rem] uppercase tracking-[0.28em] text-ash">Adres</p>
          <address className="mt-6 not-italic font-display text-2xl leading-snug text-cream sm:text-[1.7rem]">
            {LOCATION.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <div className="hairline mt-8 mb-6 max-w-[13rem]" />
          <p className="font-body text-sm leading-relaxed text-cream/58">
            <a href={LOCATION.phoneHref} className="transition-colors duration-200 hover:text-gold cursor-pointer">
              {LOCATION.phone}
            </a>
            <br />
            <a href={LOCATION.emailHref} className="transition-colors duration-200 hover:text-gold cursor-pointer">
              {LOCATION.email}
            </a>
          </p>
        </Reveal>

        {/* Hours */}
        <Reveal delay={0.08} className="flex flex-col">
          <p className="font-body text-[0.7rem] uppercase tracking-[0.28em] text-ash">Saatler</p>
          <dl className="mt-6">
            {LOCATION.hours.map(({ days, time }) => (
              <div
                key={days}
                className="flex items-baseline justify-between gap-6 border-b border-gold/[0.08] py-4 first:border-t"
              >
                <dt className="font-display text-lg text-cream">{days}</dt>
                <dd className="font-body text-sm uppercase tracking-[0.12em] text-gold">{time}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* The room */}
        <Reveal delay={0.16} className="flex flex-col">
          <p className="font-body text-[0.7rem] uppercase tracking-[0.28em] text-ash">Salon</p>
          <div className="mt-6 space-y-5 font-body leading-relaxed text-cream/58">
            {LOCATION.room.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
