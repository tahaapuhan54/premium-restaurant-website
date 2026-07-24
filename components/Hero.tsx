import Embers from './Embers';
import SmoothScrollHero from './ui/smooth-scroll-hero';
import { HERO_FRAMES } from '@/lib/hero';

/**
 * The opening reveal.
 *
 * The intro cascade is CSS, not Framer Motion, and this stays a server component
 * on purpose: the hero copy is the page's LCP element, and a Framer `initial`
 * ships it to the browser as `style="opacity:0"` — invisible until React has
 * hydrated and run the animation. As keyframes it paints with the very first
 * frame, and the same staggered arrival costs nothing on the main thread.
 *
 * Delays are `[animation-delay:…]` utilities so the whole cascade reads in order
 * here rather than being spread across a variants file.
 */
export default function Hero() {
  return (
    <section id="top">
      <SmoothScrollHero frames={HERO_FRAMES} initialClipPercentage={25} finalClipPercentage={75}>
        {/* Slow-pulsing ember glow behind the type */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/20 blur-[120px] animate-glowPulse"
        />

        <Embers />

        {/* Content */}
        <div className="relative z-10 mx-auto flex h-full max-w-container flex-col items-center justify-center px-5 text-center">
          <p className="eyebrow mb-7 before:hidden animate-introFade [animation-delay:0.05s]">
            <span className="h-px w-10 bg-gold/60" />
            Karaköy · Est. 2019 · Ateşin Sanatı
            <span className="h-px w-10 bg-gold/60" />
          </p>

          {/* Masked, staggered wordmark reveal */}
          <h1 className="font-display font-medium uppercase leading-[0.88] tracking-[0.07em] text-cream">
            <span className="block overflow-hidden">
              <span className="block text-[17vw] animate-introRise [animation-delay:0.12s] sm:text-[14vw] lg:text-[11.5rem]">
                KÖZ
              </span>
            </span>
            <span className="mt-1 block overflow-hidden">
              <span className="block text-[17vw] animate-introRise [animation-delay:0.26s] sm:text-[14vw] lg:text-[11.5rem]">
                <span className="italic font-normal normal-case text-gilt">&amp;</span> KÖMÜR
              </span>
            </span>
          </h1>

          {/* Italic-serif tagline */}
          <span className="mt-6 block overflow-hidden">
            <span className="block font-display text-xl italic text-cream/70 animate-introRise [animation-delay:0.4s] sm:text-2xl">
              Istanbul Chophouse.
            </span>
          </span>

          <p className="mt-8 max-w-xl text-balance text-base leading-relaxed text-cream/60 animate-introFade [animation-delay:0.5s] sm:text-lg">
            45 gün dinlendirilmiş Anadolu eti ve wagyu, canlı köz üzerinde mühürlenir —
            Boğaz’ın üzerinde, ateşe adanmış bir sofrada.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 animate-introFade [animation-delay:0.62s] sm:flex-row">
            <a href="#reserve" className="btn-ember cursor-pointer">
              Masa Ayırt
            </a>
            <a href="#menu" className="btn-ghost cursor-pointer">
              Menüyü Keşfet
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 animate-introIn [animation-delay:0.9s]">
          <div className="flex flex-col items-center gap-2 text-ash">
            <span className="font-body text-[0.6rem] uppercase tracking-[0.4em]">Kaydır</span>
            <span className="relative flex h-9 w-5 justify-center rounded-full border border-gold/30">
              <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-ember animate-scrollCue" />
            </span>
          </div>
        </div>
      </SmoothScrollHero>
    </section>
  );
}
