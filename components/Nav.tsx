'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE } from '@/lib/motion';

const LINKS = [
  { label: 'Hikâye', href: '#story' },
  { label: 'İmza Etler', href: '#signature' },
  { label: 'Menü', href: '#menu' },
  { label: 'Şef', href: '#chef' },
  { label: 'İletişim', href: '#visit' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'border-b border-gold/10 bg-char-950/80 backdrop-blur-md py-4'
          : 'border-b border-transparent bg-transparent py-6'
      }`}
    >
      <nav className="mx-auto flex max-w-container items-center justify-between px-6 sm:px-10">
        {/* Wordmark */}
        {/* The accessible name leads with the visible wordmark, so voice control
            ("click KÖZ & Kömür") matches what is actually on screen. */}
        <a
          href="#top"
          className="group flex items-baseline gap-[0.65em] font-display text-[0.95rem] uppercase text-gold/90 transition-colors duration-300 hover:text-gold sm:text-base"
          aria-label="KÖZ & Kömür — ana sayfa"
        >
          {/* The explicit spaces keep the text content readable as "KÖZ & Kömür"
              rather than "KÖZ&Kömür"; whitespace-only nodes between flex items
              are not rendered, so the gap-driven layout is untouched. */}
          <span className="tracking-[0.34em]">KÖZ</span>{' '}
          <span className="translate-y-[-0.15em] text-gold/40">&amp;</span>{' '}
          <span className="tracking-[0.34em]">Kömür</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-11 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative font-body text-[0.7rem] uppercase tracking-[0.22em] text-cream/58 transition-colors duration-300 hover:text-cream"
              >
                {l.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-100 bg-gold/25 transition-colors duration-300 group-hover:bg-gold" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#reserve"
            className="btn-ember hidden sm:inline-flex cursor-pointer"
          >
            Rezervasyon
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={open}
            className="relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gold/20 text-cream lg:hidden cursor-pointer"
          >
            <span className="sr-only">Menü</span>
            <div className="flex flex-col gap-[5px]">
              <span
                className={`block h-px w-5 bg-current transition-all duration-300 ${
                  open ? 'translate-y-[6px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-px w-5 bg-current transition-all duration-300 ${
                  open ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-px w-5 bg-current transition-all duration-300 ${
                  open ? '-translate-y-[6px] -rotate-45' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="fixed inset-0 z-40 bg-char-950/97 backdrop-blur-lg lg:hidden"
          >
            <ul className="flex h-full flex-col items-center justify-center gap-8">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, ease: EASE }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-3xl italic text-cream/75"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, ease: EASE }}
              >
                <a href="#reserve" onClick={() => setOpen(false)} className="btn-ember mt-4 cursor-pointer">
                  Masa Ayırt
                </a>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
