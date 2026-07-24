/**
 * Fixed, non-interactive film-grain + vignette layer that sits above everything
 * to give the whole page a shot-on-film warmth. Pure CSS, ~0 runtime cost.
 */
export default function Grain() {
  return (
    <>
      <div
        aria-hidden
        className="grain-overlay pointer-events-none fixed inset-0 z-[60] opacity-[0.05] mix-blend-soft-light"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[59] mix-blend-multiply"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(11,9,8,0.55) 100%)',
        }}
      />
    </>
  );
}
