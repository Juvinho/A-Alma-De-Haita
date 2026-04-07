import type { Metadata } from 'next';
import '@/styles/globals.css';
import '@/styles/sprite.css';
import { HorrorProvider } from '@/contexts/HorrorContext';
import { AudioProvider } from '@/contexts/AudioContext';
import VeilTransition from '@/components/VeilTransition';
import AppShellEffects from '@/components/AppShellEffects';

export const metadata: Metadata = {
  metadataBase: new URL('https://haita.varguelia.net'),
  title: 'Os Véus de Häita',
  description: 'Vocês rezam para um deus mudo. E ignoram a deusa que nunca parou de gritar.',
  keywords: ['Häita', 'Fundação Varguelia', 'enigmas', 'Catatúnia'],
  openGraph: {
    title: 'Os Véus de Häita',
    description: 'Vocês rezam para um deus mudo. E ignoram a deusa que nunca parou de gritar.',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Os Véus de Häita',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Os Véus de Häita',
    description: 'Vocês rezam para um deus mudo. E ignoram a deusa que nunca parou de gritar.',
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)] min-h-screen antialiased">
        <HorrorProvider>
          <AudioProvider>
            <AppShellEffects />

            {/* Page transitions + content */}
            <VeilTransition>
              {children}
            </VeilTransition>
          </AudioProvider>
        </HorrorProvider>
      </body>
    </html>
  );
}
