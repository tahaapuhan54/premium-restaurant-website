/**
 * Hero frame-sequence configuration.
 *
 * The hero background is a scrubbed still sequence (24 fps, 10 s of rising smoke)
 * in `public/assets/smoke-frames`. Nothing plays on its own — the wheel position
 * picks exactly one still, so a rewind is as smooth as playing forward.
 *
 * Deliberately dependency-free: `tailwind.config.ts` imports `HERO_SCROLL_LENGTH`
 * from here so the wrapper height token and the scroll transforms share one number.
 */

/** Length of the scroll-driven reveal, in px. */
export const HERO_SCROLL_LENGTH = 1500;

/** Stills on disk. */
export const HERO_FRAME_COUNT = 240;

/** Native width of a still — decoding above this only wastes memory. */
export const HERO_FRAME_WIDTH = 1280;

export const HERO_FRAMES: readonly string[] = Array.from(
  { length: HERO_FRAME_COUNT },
  (_, i) => `/assets/smoke-frames/frame-${String(i + 1).padStart(4, '0')}.webp`,
);

/** The still the reveal opens on — also the poster shown while the sequence warms up. */
export const HERO_POSTER = HERO_FRAMES[0];

/**
 * How hard we are willing to work the device.
 *
 * Every knob trades bytes/memory for temporal resolution. The full 240-still
 * sequence is ~12 MB and, decoded, hundreds of MB — far too much for a phone,
 * so weaker devices get a shorter sequence decoded at a smaller size.
 */
export interface HeroQuality {
  /** Take every Nth still. 1 = the full 24 fps sequence. */
  stride: number;
  /** Width the stills around the playhead are decoded at. */
  decodeWidth: number;
  /** Every Nth kept still is also held forever as a cheap low-res fallback. */
  keyframeStride: number;
  /** Width those permanent fallback stills are decoded at. */
  keyframeWidth: number;
  /** How far ahead of / behind the playhead stills are decoded. */
  windowRadius: number;
  /** Ceiling on full-res stills held at once — the memory budget. */
  maxResident: number;
  /** Parallel fetch + decode workers. */
  concurrency: number;
}

/** Desktop with headroom: every still, near-native resolution. */
const CINEMATIC: HeroQuality = {
  stride: 1,
  decodeWidth: 1152,
  keyframeStride: 8,
  keyframeWidth: 448,
  windowRadius: 18,
  maxResident: 40,
  concurrency: 8,
};

/** Smaller laptops and older CPUs: half the stills, still fluid. */
const BALANCED: HeroQuality = {
  stride: 2,
  decodeWidth: 960,
  keyframeStride: 6,
  keyframeWidth: 400,
  windowRadius: 14,
  maxResident: 28,
  concurrency: 6,
};

/** Phones and tablets: a third of the stills, tight memory budget. */
const LEAN: HeroQuality = {
  stride: 3,
  decodeWidth: 720,
  keyframeStride: 5,
  keyframeWidth: 360,
  windowRadius: 10,
  maxResident: 20,
  concurrency: 4,
};

/** Save-Data or a slow radio: keep it to a couple of MB. */
const FRUGAL: HeroQuality = {
  stride: 5,
  decodeWidth: 560,
  keyframeStride: 4,
  keyframeWidth: 320,
  windowRadius: 8,
  maxResident: 14,
  concurrency: 3,
};

/** The slice of the Network Information API we actually read. */
interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

/** Navigator plus the client-hint fields TypeScript's DOM lib omits. */
interface NavigatorLike extends Navigator {
  connection?: NetworkInformationLike;
  deviceMemory?: number;
}

const SLOW_NETWORKS = ['slow-2g', '2g', '3g'];

/**
 * Picks a tier from the device's own hints. SSR-safe: without a `window` it
 * returns the balanced tier, which is also what the first client render uses
 * until the real sequence mounts.
 */
export function pickHeroQuality(): HeroQuality {
  if (typeof window === 'undefined') return BALANCED;

  const nav = navigator as NavigatorLike;
  const connection = nav.connection;

  if (connection?.saveData || SLOW_NETWORKS.includes(connection?.effectiveType ?? '')) {
    return FRUGAL;
  }

  const memory = nav.deviceMemory ?? 8;
  const cores = nav.hardwareConcurrency ?? 8;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  if (coarse || window.innerWidth < 768 || memory <= 4) return LEAN;
  if (window.innerWidth < 1280 || cores <= 4 || memory <= 8) return BALANCED;
  return CINEMATIC;
}

/** Keeps every Nth still, always preserving the closing one. */
export function strideFrames(frames: readonly string[], stride: number): string[] {
  if (stride <= 1) return [...frames];

  const kept: string[] = [];
  for (let i = 0; i < frames.length; i += stride) kept.push(frames[i]);

  const last = frames[frames.length - 1];
  if (kept[kept.length - 1] !== last) kept.push(last);
  return kept;
}
