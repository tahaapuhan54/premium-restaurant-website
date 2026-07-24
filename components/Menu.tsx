'use client';

import { motion } from 'framer-motion';
import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import { fadeUp, stagger } from '@/lib/motion';
import { MENU } from '@/lib/content';

export default function Menu() {
  return (
    <section id="menu" className="relative mx-auto max-w-container px-5 py-28 sm:px-8 lg:py-36">
      <div className="mb-16 flex flex-col items-center text-center">
        <SectionHeading
          align="center"
          kicker="Menü"
          title="Ateşten sofraya"
          italicWord="sofraya"
        />
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-lg text-balance text-cream/58">
            Mevsime ve dinlendirme odasına göre değişir. Fiyatlar Türk Lirası (₺) cinsindendir.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-x-16 gap-y-14 md:grid-cols-2">
        {MENU.map((cat) => (
          <div key={cat.id} className="relative">
            <Reveal>
              <div className="flex items-baseline gap-4">
                <h3 className="font-display text-3xl italic text-cream">{cat.title}</h3>
                <span className="font-body text-[0.65rem] uppercase tracking-[0.28em] text-ember/80">
                  {cat.kicker}
                </span>
              </div>
              <div className="mt-5 hairline" />
            </Reveal>

            <motion.ul
              variants={stagger(0.05, 0.08)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="mt-6 space-y-6"
            >
              {cat.items.map((item) => (
                <motion.li
                  key={item.name}
                  variants={fadeUp}
                  className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4"
                >
                  <div className="flex items-baseline gap-2">
                    <h4 className="font-body text-base font-semibold text-cream transition-colors duration-200 group-hover:text-gold-light">
                      {item.name}
                    </h4>
                    {item.tag && (
                      <span className="translate-y-[-1px] rounded-full border border-ember/40 px-2 py-0.5 font-body text-[0.55rem] uppercase tracking-[0.15em] text-ember">
                        {item.tag}
                      </span>
                    )}
                    {/* dotted leader */}
                    <span className="mx-1 hidden flex-1 translate-y-[-3px] border-b border-dotted border-gold/25 sm:block" />
                  </div>
                  <span className="font-display text-lg text-gilt">{item.price}</span>
                  <p className="col-span-2 -mt-1 max-w-md font-body text-sm leading-relaxed text-ash">
                    {item.desc}
                  </p>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-16 flex justify-center">
        <p className="text-center text-sm text-ash">
          Alerji ve özel istekler için servis ekibimize danışın ·{' '}
          <a href="#reserve" className="text-gold underline-offset-4 hover:underline cursor-pointer">
            Masa ayırtın
          </a>
        </p>
      </Reveal>
    </section>
  );
}
