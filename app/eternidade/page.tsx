import type { Metadata } from 'next';
import EternidadeClient from './EternidadeClient';

export const metadata: Metadata = {
  title: 'Mahasse',
  description: 'Nao como prece. Como fato.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function EternidadePage() {
  return <EternidadeClient />;
}
