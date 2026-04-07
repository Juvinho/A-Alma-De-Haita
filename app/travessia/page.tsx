import type { Metadata } from 'next';
import TravessiaClient from './TravessiaClient';

export const metadata: Metadata = {
  title: '—',
  description: 'Entre os mundos.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function TravessiaPage() {
  return <TravessiaClient />;
}
