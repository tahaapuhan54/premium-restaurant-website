import Reveal from './Reveal';

export default function SectionHeading({
  kicker,
  title,
  italicWord,
  align = 'left',
  className = '',
}: {
  kicker: string;
  title: string;
  italicWord?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  const parts = italicWord ? title.split(italicWord) : [title];
  return (
    <div
      className={`${align === 'center' ? 'items-center text-center' : 'items-start'} flex flex-col ${className}`}
    >
      <Reveal>
        <span className="eyebrow mb-5">{kicker}</span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="max-w-3xl font-display text-4xl font-medium leading-[1.05] text-cream sm:text-5xl lg:text-6xl">
          {italicWord ? (
            <>
              {parts[0]}
              <span className="text-gilt italic">{italicWord}</span>
              {parts[1]}
            </>
          ) : (
            title
          )}
        </h2>
      </Reveal>
    </div>
  );
}
