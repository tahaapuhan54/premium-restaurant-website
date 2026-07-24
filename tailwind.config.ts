import type { Config } from 'tailwindcss';
import { HERO_SCROLL_LENGTH } from './lib/hero';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm near-black base — the room after the lights go down.
        char: {
          950: '#0B0908',
          900: '#100C0A',
          800: '#16110D',
          700: '#1E1712',
          600: '#2A201A',
        },
        // Live fire.
        ember: {
          DEFAULT: '#C8632E',
          light: '#E07B3C',
          deep: '#8F3A19',
        },
        // Antique gold for hairlines & wordmark detail.
        gold: {
          DEFAULT: '#C7A15A',
          light: '#E4C989',
          deep: '#8C6A32',
        },
        // Aged-beef oxblood, used sparingly for depth.
        oxblood: '#6E1F17',
        cream: '#F3EBDD',
        ash: '#A89A86',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        eyebrow: '0.42em',
      },
      transitionTimingFunction: {
        // Mirrors EASE in lib/motion.ts — slow to leave, gentle to arrive.
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      maxWidth: {
        container: '80rem',
      },
      spacing: {
        // Diameter of the cursor light's outer halo (centred with -ml-56/-mt-56).
        112: '28rem',
      },
      height: {
        // Hero wrapper: the sticky viewport plus the scroll length that scrubs it.
        'hero-scroll': `calc(${HERO_SCROLL_LENGTH}px + 100svh)`,
      },
      keyframes: {
        emberFloat: {
          '0%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '10%': { opacity: '0.9' },
          '90%': { opacity: '0.4' },
          '100%': { transform: 'translateY(-120px) translateX(14px)', opacity: '0' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.06)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        // Hero intro. These run as CSS rather than through Framer Motion so the
        // opening type paints with the first frame instead of waiting for React
        // to hydrate — the hero copy is the LCP element.
        introRise: {
          from: { transform: 'translateY(110%)' },
          to: { transform: 'translateY(0)' },
        },
        introFade: {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        introIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        scrollCue: {
          '0%, 100%': { transform: 'translateY(3px)', opacity: '1' },
          '50%': { transform: 'translateY(14px)', opacity: '0.2' },
        },
      },
      animation: {
        glowPulse: 'glowPulse 7s ease-in-out infinite',
        // `both` holds the from-state through the stagger delay, so an element
        // scheduled late is not briefly visible before its turn.
        introRise: 'introRise 1s cubic-bezier(0.22, 1, 0.36, 1) both',
        introFade: 'introFade 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        introIn: 'introIn 1s cubic-bezier(0.22, 1, 0.36, 1) both',
        scrollCue: 'scrollCue 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
