import type { Metadata, Viewport } from 'next';
import { Bodoni_Moda, Manrope } from 'next/font/google';
import './globals.css';

// Both faces are loaded as variable fonts: one file per style covers the whole
// weight range, instead of a static file per weight. That takes the page from
// 17 font downloads to 3 without changing a single rendered weight.
const display = Bodoni_Moda({
  subsets: ['latin', 'latin-ext'],
  weight: 'variable',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
  // Bodoni Moda has no metric-override data in next/font, which prints a build
  // warning on every compile; a serif fallback silences it cleanly.
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
  adjustFontFallback: false,
});

const body = Manrope({
  subsets: ['latin', 'latin-ext'],
  weight: 'variable',
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://koz-istanbul.example'),
  title: 'KÖZ — Istanbul Chophouse | Ateşin Sanatı',
  description:
    'KÖZ is a fire-first chophouse in Karaköy, Istanbul. Dry-aged Anatolian beef and Wagyu cooked over live coals, served above the Bosphorus.',
  keywords: [
    'steakhouse Istanbul',
    'dry-aged steak',
    'Karaköy restaurant',
    'ocakbaşı',
    'Wagyu Istanbul',
    'fine dining Bosphorus',
  ],
  openGraph: {
    title: 'KÖZ — Istanbul Chophouse',
    description:
      'Dry-aged beef over live coals, above the Bosphorus. Karaköy, Istanbul.',
    type: 'website',
    locale: 'tr_TR',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0B0908',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${display.variable} ${body.variable}`}>
      {/* Browser extensions (ColorZilla, Grammarly and friends) tag <body> with
          their own attributes before React hydrates, which reads as a server/client
          mismatch in dev. Suppression here covers this element's own attributes
          only — it does not extend into the tree, so real hydration bugs in
          components still surface. */}
      <body className="overflow-x-hidden antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
