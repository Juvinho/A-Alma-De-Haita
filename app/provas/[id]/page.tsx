import ProvaPageClient from './ProvaPageClient';

export function generateStaticParams() {
  const provaIds = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];
  return provaIds.map((id) => ({ id }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProvaPage({ params }: Props) {
  const { id } = await params;
  return <ProvaPageClient id={id} />;
}
