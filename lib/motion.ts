import type { Variants } from 'framer-motion';

// A calm, cinematic easing — slow to leave, gentle to arrive.
export const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 1.1, ease: EASE } },
};

// Parent that staggers its children in sequence.
export const stagger = (delay = 0, step = 0.12): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: step, delayChildren: delay },
  },
});

// A hairline that draws itself out from its left edge.
export const lineGrow: Variants = {
  hidden: { scaleX: 0 },
  show: {
    scaleX: 1,
    transition: { duration: 1.2, ease: EASE },
  },
};

// A line of type that rises out of an overflow-hidden mask.
export const maskRise: Variants = {
  hidden: { y: '110%' },
  show: {
    y: '0%',
    transition: { duration: 1, ease: EASE },
  },
};

export const viewportOnce = { once: true, amount: 0.3 } as const;
