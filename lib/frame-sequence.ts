/**
 * A scrubbable still sequence.
 *
 * Naively holding 240 decoded 1280×720 stills costs ~900 MB of bitmap memory and
 * 12 MB of network before the hero can move. This does three things instead:
 *
 *  1. **Keyframes first.** A sparse pass of small stills is decoded up front, so the
 *     entire timeline is scrubbable within a second — a fast flick can never blank.
 *  2. **A moving window.** Full-resolution stills are only decoded around the
 *     playhead, biased toward the scroll direction, and closed once they drift out.
 *  3. **Decode-time downscaling.** `createImageBitmap` resizes during decode, so a
 *     still costs a fraction of its native bitmap and `drawImage` fills less.
 *
 * The result is bounded memory at any sequence length, with a still always ready
 * for whatever position the wheel lands on.
 */

import type { HeroQuality } from './hero';

/** `createImageBitmap` where available, a decoded `<img>` where it is not. */
export type DecodedFrame = ImageBitmap | HTMLImageElement;

/** `priority` ships in Chromium but is not in the DOM lib yet. */
interface PrioritizedRequestInit extends RequestInit {
  priority?: 'high' | 'low' | 'auto';
}

export function frameSize(frame: DecodedFrame): { width: number; height: number } {
  return 'naturalWidth' in frame
    ? { width: frame.naturalWidth, height: frame.naturalHeight }
    : { width: frame.width, height: frame.height };
}

function closeFrame(frame: DecodedFrame): void {
  if ('close' in frame) frame.close();
}

/** Decodes at `width`, keeping the aspect ratio. Falls back gracefully twice. */
async function decodeFrame(blob: Blob, width: number): Promise<DecodedFrame> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(blob, { resizeWidth: width, resizeQuality: 'high' });
    } catch {
      // Older Safari rejects the options bag — take the still at native size.
      return await createImageBitmap(blob);
    }
  }

  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    img.decoding = 'async';
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Runs `task` over `items` with at most `limit` in flight. */
async function pool<T>(items: T[], limit: number, task: (item: T) => Promise<void>): Promise<void> {
  let cursor = 0;
  const worker = async (): Promise<void> => {
    while (cursor < items.length) {
      const item = items[cursor];
      cursor += 1;
      await task(item);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
}

export class FrameSequence {
  readonly length: number;

  private readonly urls: string[];
  private readonly quality: HeroQuality;

  /** Full-resolution stills, evicted as the playhead moves on. */
  private readonly sharp: (DecodedFrame | null)[];
  /** Small stills kept for the lifetime of the sequence — the safety net. */
  private readonly coarse: (DecodedFrame | null)[];

  private readonly resident = new Set<number>();
  private readonly inFlight = new Set<number>();
  private queue: number[] = [];
  private workers = 0;

  private playhead = 0;
  private direction: 1 | -1 = 1;
  private started = false;

  private readonly controller = new AbortController();
  private disposed = false;
  private priming: Promise<void> | null = null;

  constructor(urls: string[], quality: HeroQuality) {
    this.urls = urls;
    this.quality = quality;
    this.length = urls.length;
    this.sharp = new Array<DecodedFrame | null>(this.length).fill(null);
    this.coarse = new Array<DecodedFrame | null>(this.length).fill(null);
  }

  /**
   * Resolves once the opening still and the keyframe pass are decoded — the point
   * at which every scroll position has something to show. Never rejects: a failed
   * still just leaves its slot empty and a neighbour covers for it.
   */
  prime(): Promise<void> {
    if (!this.priming) this.priming = this.runPrime();
    return this.priming;
  }

  private async runPrime(): Promise<void> {
    await this.loadCoarse(0, 'high');
    if (this.disposed) return;

    const keyframes: number[] = [];
    for (let i = 1; i < this.length; i += 1) {
      if (this.isKeyframe(i)) keyframes.push(i);
    }
    await pool(keyframes, this.quality.concurrency, (i) => this.loadCoarse(i, 'low'));
  }

  private isKeyframe(index: number): boolean {
    return index % this.quality.keyframeStride === 0 || index === this.length - 1;
  }

  /**
   * The best still available for `index`: the sharp one, else its coarse stand-in,
   * else the nearest neighbour that has landed. Only returns null before priming.
   */
  frameAt(index: number): DecodedFrame | null {
    const exact = this.sharp[index] ?? this.coarse[index];
    if (exact) return exact;

    for (let offset = 1; offset < this.length; offset += 1) {
      const before = index - offset;
      if (before >= 0) {
        const frame = this.sharp[before] ?? this.coarse[before];
        if (frame) return frame;
      }
      const after = index + offset;
      if (after < this.length) {
        const frame = this.sharp[after] ?? this.coarse[after];
        if (frame) return frame;
      }
    }
    return null;
  }

  /** Moves the decode window. Cheap enough to call on every animation frame. */
  setPlayhead(index: number): void {
    if (this.disposed) return;
    if (this.started && index === this.playhead) return;
    this.direction = index >= this.playhead ? 1 : -1;
    this.playhead = index;
    this.started = true;
    this.schedule();
    this.trim();
  }

  private needs(index: number): boolean {
    return (
      index >= 0 &&
      index < this.length &&
      !this.sharp[index] &&
      !this.inFlight.has(index)
    );
  }

  /**
   * Rebuilds the wanted list from the playhead outward: everything ahead in the
   * scroll direction, and half as far behind, so a rewind stays sharp too.
   */
  private schedule(): void {
    const { windowRadius } = this.quality;
    const ahead = this.direction;
    const wanted: number[] = [];

    if (this.needs(this.playhead)) wanted.push(this.playhead);
    for (let offset = 1; offset <= windowRadius; offset += 1) {
      const front = this.playhead + offset * ahead;
      if (this.needs(front)) wanted.push(front);
      if (offset * 2 <= windowRadius) {
        const back = this.playhead - offset * ahead;
        if (this.needs(back)) wanted.push(back);
      }
    }

    this.queue = wanted;
    this.pump();
  }

  private pump(): void {
    while (!this.disposed && this.workers < this.quality.concurrency && this.queue.length > 0) {
      const index = this.queue.shift();
      if (index === undefined || !this.needs(index)) continue;

      this.workers += 1;
      void this.loadSharp(index).then(() => {
        this.workers -= 1;
        this.pump();
      });
    }
  }

  private async loadSharp(index: number): Promise<void> {
    const frame = await this.fetchFrame(index, this.quality.decodeWidth, 'auto');
    if (!frame) return;

    if (this.disposed || this.sharp[index]) {
      closeFrame(frame);
      return;
    }
    this.sharp[index] = frame;
    this.resident.add(index);
    this.trim();
  }

  private async loadCoarse(index: number, priority: 'high' | 'low'): Promise<void> {
    const frame = await this.fetchFrame(index, this.quality.keyframeWidth, priority);
    if (!frame) return;

    if (this.disposed || this.coarse[index]) {
      closeFrame(frame);
      return;
    }
    this.coarse[index] = frame;
  }

  private async fetchFrame(
    index: number,
    width: number,
    priority: 'high' | 'low' | 'auto',
  ): Promise<DecodedFrame | null> {
    if (this.disposed) return null;
    this.inFlight.add(index);
    try {
      const init: PrioritizedRequestInit = { signal: this.controller.signal, priority };
      const response = await fetch(this.urls[index], init);
      if (!response.ok) return null;
      const blob = await response.blob();
      if (this.disposed) return null;
      return await decodeFrame(blob, width);
    } catch {
      // Aborted, offline, or an undecodable still — a neighbour covers the gap.
      return null;
    } finally {
      this.inFlight.delete(index);
    }
  }

  /** Drops the sharp stills furthest from the playhead until we are under budget. */
  private trim(): void {
    const excess = this.resident.size - this.quality.maxResident;
    if (excess <= 0) return;

    const furthest = [...this.resident].sort(
      (a, b) => Math.abs(b - this.playhead) - Math.abs(a - this.playhead),
    );
    for (let n = 0; n < excess; n += 1) {
      const index = furthest[n];
      const frame = this.sharp[index];
      if (frame) closeFrame(frame);
      this.sharp[index] = null;
      this.resident.delete(index);
    }
  }

  /**
   * Frees the full-resolution window but keeps the keyframes, so a hero that
   * unmounts and comes back is instantly scrubbable again.
   */
  release(): void {
    this.queue = [];
    for (const index of this.resident) {
      const frame = this.sharp[index];
      if (frame) closeFrame(frame);
      this.sharp[index] = null;
    }
    this.resident.clear();
  }

  /** Full teardown: cancels in-flight fetches and closes every bitmap. */
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.controller.abort();
    this.release();
    for (let i = 0; i < this.length; i += 1) {
      const frame = this.coarse[i];
      if (frame) closeFrame(frame);
      this.coarse[i] = null;
    }
  }
}

type SequenceEntry =
  | { status: 'pending'; promise: Promise<void> }
  | { status: 'ready'; sequence: FrameSequence };

const sequences = new Map<string, SequenceEntry>();

/**
 * Suspense resource: throws until the sequence is primed, then hands it back.
 * Sequences outlive the component that read them, so a remount (Strict Mode's
 * double render included) reuses the decoded keyframes instead of refetching.
 *
 * Client-only — call it from a component that does not render on the server.
 */
export function readFrameSequence(key: string, create: () => FrameSequence): FrameSequence {
  const entry = sequences.get(key);
  if (entry) {
    if (entry.status === 'ready') return entry.sequence;
    throw entry.promise;
  }

  const sequence = create();
  const settle = (): void => {
    sequences.set(key, { status: 'ready', sequence });
  };
  const promise = sequence.prime().then(settle, settle);
  sequences.set(key, { status: 'pending', promise });
  throw promise;
}
