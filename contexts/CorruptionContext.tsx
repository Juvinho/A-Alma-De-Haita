'use client';

import { createContext, useContext } from 'react';
import { useCorruption, type UseCorruptionReturn } from '@/hooks/useCorruption';

const CorruptionContext = createContext<UseCorruptionReturn | null>(null);

export function CorruptionProvider({ children }: { children: React.ReactNode }) {
  const corruption = useCorruption();
  return (
    <CorruptionContext.Provider value={corruption}>
      {children}
    </CorruptionContext.Provider>
  );
}

export function useCorruptionCtx(): UseCorruptionReturn {
  const ctx = useContext(CorruptionContext);
  if (!ctx) throw new Error('useCorruptionCtx must be used inside CorruptionProvider');
  return ctx;
}
