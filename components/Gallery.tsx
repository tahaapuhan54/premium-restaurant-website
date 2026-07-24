'use client';

import Image from 'next/image';
import Reveal from './Reveal';

const IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1000&q=80',
    alt: 'Közün üzerinde mühürlenen kalın kesim et',
  },
  {
    src: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=1000&q=80',
    alt: 'Loş ışıkta hazırlanan servis tabağı',
  },
  {
    src: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1000&q=80',
    alt: 'Dilimlenmiş dry-aged biftek, deniz tuzu ile',
  },
  {
    src: 'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=1000&q=80',
    alt: 'Kırmızı şarap kadehi ve mum ışığı',
  },
  {
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80',
    alt: 'Sofraya gelen közlenmiş et tabağı',
  },
  {
    src: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1000&q=80',
    alt: 'Restoranın sıcak, atmosferik iç mekânı',
  },
];

// Duplicate the list so the marquee loops seamlessly.
const LOOP = [...IMAGES, ...IMAGES];

export default function Gallery() {
  return (
    <section className="relative overflow-hidden py-24 lg:py-28">
      <Reveal className="mx-auto mb-12 max-w-container px-5 sm:px-8">
        <div className="flex items-center justify-between">
          <span className="eyebrow">Atmosfer</span>
          <span className="font-body text-xs uppercase tracking-[0.28em] text-ash">
            Karaköy · Boğaz
          </span>
        </div>
      </Reveal>

      {/* Auto-scrolling marquee; pauses on hover, stops for reduced-motion */}
      <div
        className="group relative flex w-full overflow-hidden"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)',
        }}
      >
        <div className="flex shrink-0 animate-[marquee_48s_linear_infinite] gap-4 pr-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {LOOP.map((img, i) => (
            <div
              key={i}
              className="relative h-64 w-[22rem] shrink-0 overflow-hidden rounded-[3px] border border-gold/10 sm:h-80 sm:w-[28rem]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="28rem"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-char-950/20" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
