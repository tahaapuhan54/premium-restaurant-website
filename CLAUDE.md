# CLAUDE.md

Bu dosya, bu depoda çalışırken Claude Code'a (claude.ai/code) rehberlik eder.

## Proje

**KÖZ — Istanbul Chophouse** — premium bir steakhouse için sinematik, tek sayfalık (single-page) tanıtım sitesi. Amaç; sıcak, karanlık ve "ateş" temalı bir atmosfer ile üst düzey bir marka deneyimi sunmaktır.

## Teknoloji Yığını (Stack)

| Katman        | Teknoloji                          |
| ------------- | ---------------------------------- |
| Framework     | **Next.js 14** (App Router)        |
| Dil           | **TypeScript** (strict mode)       |
| Stil          | **Tailwind CSS 3**                 |
| Animasyon     | Framer Motion                      |
| Build/CSS     | PostCSS + Autoprefixer             |

## Kurallar ve Kısıtlamalar

Bu kurallar zorunludur; kod üretirken veya düzenlerken her zaman uy:

1. **Yalnızca Tailwind CSS kullan.**
   - Tüm stiller Tailwind utility class'ları ile yazılır.
   - **Inline CSS yasak** — JSX içinde `style={{ ... }}` kullanma.
   - Ham/keyfi CSS gerektiğinde önce `tailwind.config.ts` içine token (renk, spacing, keyframe, animasyon) ekle; global stiller yalnızca `app/globals.css` içinde tanımlanır.

2. **TypeScript'te `any` kullanma.**
   - `any` yerine doğru tipleri, `unknown` + tip daraltma (narrowing), generic'ler veya union tiplerini kullan.
   - `strict` mode açıktır; implicit `any` de yasaktır.

3. **Genel ilkeler.**
   - Bileşenler `components/` altında, tek bir sorumluluğa sahip olacak şekilde tutulur.
   - Statik içerik (metin, menü, veriler) `lib/content.ts` içinde toplanır; bileşenlerin içine gömme.
   - Import'larda `@/*` alias'ı kullan (ör. `@/components/Hero`).

## Komutlar

```bash
npm run dev      # Geliştirme sunucusu (localhost:3000)
npm run build    # Production build
npm run start    # Production sunucusunu başlat
npm run lint     # Next.js ESLint kontrolü
```

## Klasör Yapısı

```
premium-website/
├── app/                      # Next.js App Router
│   ├── globals.css           # Global stiller + Tailwind direktifleri (@tailwind base/components/utilities)
│   ├── layout.tsx            # Root layout — fontlar, <html>/<body>, metadata
│   └── page.tsx              # Ana sayfa — tüm bölümleri (section) birleştirir
│
├── components/               # Yeniden kullanılabilir UI bileşenleri
│   ├── Nav.tsx               # Üst navigasyon
│   ├── Hero.tsx              # Açılış / hero bölümü
│   ├── Story.tsx             # Marka hikâyesi
│   ├── Signature.tsx         # İmza yemekler / öne çıkanlar
│   ├── Menu.tsx              # Menü bölümü
│   ├── Chef.tsx              # Şef tanıtımı
│   ├── Gallery.tsx           # Görsel galeri
│   ├── Testimonials.tsx      # Müşteri yorumları
│   ├── Reservation.tsx       # Rezervasyon çağrısı (CTA)
│   ├── Location.tsx          # Konum / adres
│   ├── Footer.tsx            # Alt bilgi
│   ├── SectionHeading.tsx    # Ortak bölüm başlığı bileşeni
│   ├── Reveal.tsx            # Scroll ile beliren animasyon sarmalayıcı
│   ├── Embers.tsx            # Ateş kıvılcımı (ember) partikül efekti
│   └── Grain.tsx             # Film grain / doku overlay
│
├── lib/                      # Yardımcılar ve içerik
│   ├── content.ts            # Site metinleri, menü ve statik veriler
│   └── motion.ts             # Framer Motion variant'ları / animasyon ayarları
│
├── public/                   # Statik dosyalar (görseller, fontlar, ikonlar)
│
├── .claude/                  # Claude Code skill'leri ve ayarları
├── tailwind.config.ts        # Tailwind tema tokenları (char/ember/gold renkleri, fontlar, keyframes)
├── postcss.config.mjs        # PostCSS (tailwindcss + autoprefixer)
├── next.config.mjs           # Next.js yapılandırması
├── tsconfig.json             # TypeScript yapılandırması (strict, @/* alias)
└── package.json              # Bağımlılıklar ve script'ler
```

## Tasarım Sistemi (tailwind.config.ts)

Tema tokenları `tailwind.config.ts` içinde tanımlıdır; keyfi (arbitrary) değerler yerine bunları kullan:

- **Renkler:**
  - `char` (950–600) — sıcak, siyaha yakın zemin tonları.
  - `ember` (`DEFAULT`, `light`, `deep`) — canlı ateş / turuncu.
  - `gold` (`DEFAULT`, `light`, `deep`) — antik altın; ince çizgiler ve marka detayı.
  - `oxblood`, `cream`, `ash` — destekleyici tonlar.
- **Fontlar:** `font-display` (serif başlıklar), `font-body` (gövde metni) — CSS değişkenleri `--font-display` / `--font-body` üzerinden.
- **Letter spacing:** `tracking-eyebrow` (0.42em) — küçük başlık/etiketler için.
- **Animasyonlar:** `animate-glowPulse`; ayrıca `emberFloat` ve `shimmer` keyframe'leri.
- **Container:** `max-w-container` (80rem).
