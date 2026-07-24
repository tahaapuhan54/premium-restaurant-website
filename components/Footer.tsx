'use client';

import Reveal from './Reveal';

const SOCIAL = [
  {
    label: 'Instagram',
    href: '#',
    path: 'M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.2 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.2 8.8 2.2 12 2.2zm0 3.05A6.75 6.75 0 1018.75 12 6.75 6.75 0 0012 5.25zm0 11.13A4.38 4.38 0 1116.38 12 4.38 4.38 0 0112 16.38zm6.99-11.4a1.58 1.58 0 11-1.58-1.57 1.58 1.58 0 011.58 1.57z',
  },
  {
    label: 'Facebook',
    href: '#',
    path: 'M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z',
  },
  {
    label: 'TripAdvisor',
    href: '#',
    path: 'M12 8.5c-2.73 0-5.2.62-7.06 1.66A3.99 3.99 0 003 13.5a4 4 0 007.06 2.55A4 4 0 0012 17a4 4 0 001.94-.95A4 4 0 0021 13.5a3.99 3.99 0 00-1.94-3.34C17.2 9.12 14.73 8.5 12 8.5zm-4.5 8a3 3 0 110-6 3 3 0 010 6zm9 0a3 3 0 110-6 3 3 0 010 6zm-9-4.6a1.6 1.6 0 100 3.2 1.6 1.6 0 000-3.2zm9 0a1.6 1.6 0 100 3.2 1.6 1.6 0 000-3.2z',
  },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-gold/[0.08] bg-char-950">
      <div className="relative mx-auto max-w-container px-5 py-20 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <Reveal>
            <a href="#top" className="font-display text-3xl font-extrabold tracking-[0.12em] text-cream cursor-pointer">
              KÖ<span className="text-gilt">Z</span>
            </a>
            <p className="mt-4 max-w-xs text-balance leading-relaxed text-ash">
              Istanbul Chophouse. 2019’dan bu yana Karaköy’de, ateşe ve tek bir kesime adanmış bir sofra.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 text-cream/65 transition-colors duration-200 hover:border-ember hover:text-ember cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <p className="font-body text-xs uppercase tracking-[0.22em] text-gold">Keşfet</p>
            <ul className="mt-5 space-y-3">
              {[
                ['Hikâye', '#story'],
                ['İmza Etler', '#signature'],
                ['Menü', '#menu'],
                ['Şef', '#chef'],
                ['Rezervasyon', '#reserve'],
              ].map(([l, h]) => (
                <li key={h}>
                  <a href={h} className="text-cream/58 transition-colors duration-200 hover:text-cream cursor-pointer">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="font-body text-xs uppercase tracking-[0.22em] text-gold">İletişim</p>
            <ul className="mt-5 space-y-3 text-cream/58">
              <li>Kemankeş Cad. No 41<br />Karaköy · İstanbul</li>
              <li><a href="tel:+902122440000" className="hover:text-cream cursor-pointer">+90 212 244 00 00</a></li>
              <li><a href="mailto:rezervasyon@koz.istanbul" className="hover:text-cream cursor-pointer">rezervasyon@koz.istanbul</a></li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-gold/[0.06] pt-8 text-center sm:flex-row sm:text-left">
          <p className="font-body text-xs text-ash">© {year} KÖZ Istanbul Chophouse. Tüm hakları saklıdır.</p>
          <p className="font-body text-xs text-ash">
            18 yaş üzeri · Sorumlu içki tüketimi · Ateşin Sanatı
          </p>
        </div>
      </div>
    </footer>
  );
}
