import { enigmas } from '@/data/enigmas';
import EnigmaPageClient from './EnigmaPageClient';

export function generateStaticParams() {
  return enigmas.map((e) => ({ id: e.id }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EnigmaPage({ params }: Props) {
  const { id } = await params;
  return <EnigmaPageClient id={id} />;
}
