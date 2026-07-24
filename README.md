# KÖZ — Istanbul Chophouse

Premium bir steakhouse için sinematik, tek sayfalık (single-page) tanıtım sitesi. Sıcak, karanlık ve "ateş" temalı bir atmosfer ile üst düzey bir marka deneyimi sunar.

## Teknoloji Yığını

| Katman    | Teknoloji                   |
| --------- | --------------------------- |
| Framework | **Next.js 14** (App Router) |
| Dil       | **TypeScript** (strict)     |
| Stil      | **Tailwind CSS 3**          |
| Animasyon | Framer Motion               |
| Build/CSS | PostCSS + Autoprefixer      |

## Kurulum

```bash
git clone https://github.com/<kullanici-adi>/koz-istanbul-chophouse.git
cd koz-istanbul-chophouse
npm install
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

## Komutlar

| Komut           | Açıklama                            |
| --------------- | ----------------------------------- |
| `npm run dev`   | Geliştirme sunucusu (localhost:3000) |
| `npm run build` | Production build                    |
| `npm run start` | Production sunucusunu başlatır      |
| `npm run lint`  | Next.js ESLint kontrolü             |

## Klasör Yapısı

```
premium-website/
├── app/                # Next.js App Router (layout, page, globals.css)
├── components/         # UI bileşenleri (Hero, Menu, Chef, Gallery, ...)
├── lib/                # content.ts (statik içerik) + motion.ts (animasyonlar)
├── public/             # Statik dosyalar
└── tailwind.config.ts  # Tema tokenları (char/ember/gold, fontlar, keyframes)
```

## Tasarım Sistemi

Tüm tema tokenları `tailwind.config.ts` içinde tanımlıdır; keyfi (arbitrary) değerler yerine bunlar kullanılır:

- **Renkler:** `char` (950–600) siyaha yakın sıcak zemin tonları, `ember` canlı ateş/turuncu, `gold` antik altın, ayrıca `oxblood`, `cream`, `ash`.
- **Fontlar:** `font-display` (serif başlıklar) ve `font-body` (gövde metni).
- **Letter spacing:** `tracking-eyebrow` (0.42em) — küçük etiket ve başlıklar için.
- **Animasyonlar:** `animate-glowPulse`; `emberFloat` ve `shimmer` keyframe'leri.

Detaylı geliştirme kuralları için [CLAUDE.md](CLAUDE.md) dosyasına bakın.
