'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVNStore } from '@/stores/vn-store';
import { VNEngine } from '@/components/vn/VNEngine';

export default function ServasGamePage() {
  const isStarted = useVNStore((s) => s.isStarted);
  const router = useRouter();

  // If user navigates directly to /servas/game without starting, redirect to title
  useEffect(() => {
    if (!isStarted) {
      router.replace('/servas');
    }
  }, [isStarted, router]);

  if (!isStarted) return null;

  return (
    <main className="w-full h-screen overflow-hidden bg-black">
      <VNEngine />
    </main>
  );
}
