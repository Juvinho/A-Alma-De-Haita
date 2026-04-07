import { Cinzel, Cormorant_Garamond, Fira_Code } from 'next/font/google';
import '@/styles/vn-tokens.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-fira',
  display: 'swap',
});

export default function ServasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`vn-root ${cinzel.variable} ${cormorant.variable} ${firaCode.variable} bg-[var(--vn-bg-primary)] text-[var(--vn-text-cream)] min-h-screen overflow-hidden`}
    >
      {children}
    </div>
  );
}
