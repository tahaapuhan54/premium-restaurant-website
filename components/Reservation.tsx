import Embers from './Embers';
import Reveal from './Reveal';

export default function Reservation() {
  return (
    <section id="reserve" className="relative overflow-hidden py-32 text-center lg:py-44">
      {/* Warm oxblood glow behind the type */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[90vh] w-[90vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-oxblood/20 blur-[140px] animate-glowPulse"
      />

      {/* Rising, drifting embers that lean toward the cursor — live fire + parallax */}
      <Embers count={34} parallax strength={45} />

      <div className="relative mx-auto flex max-w-container flex-col items-center px-5">
        <Reveal>
          <span className="eyebrow mb-8">Rezervasyon</span>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="font-display text-[12vw] font-medium uppercase leading-[0.95] tracking-[0.02em] text-cream sm:text-7xl lg:text-8xl">
            Masa <span className="italic text-gilt">Ayırtın.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-6 font-display text-xl italic text-cream/70 sm:text-2xl">
            Her akşam 18:00 – 00:00 arası, ateşin başında ağırlıyoruz.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <a href="tel:+902122440000" className="btn-ember mt-10 cursor-pointer">
            Telefonla Ayırt
            <span aria-hidden>↗</span>
          </a>
        </Reveal>

        <Reveal delay={0.32}>
          <p className="mt-10 font-body text-[0.7rem] uppercase tracking-[0.2em] text-ash/70">
            Yer olduğunda barda rezervasyonsuz ağırlarız.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
