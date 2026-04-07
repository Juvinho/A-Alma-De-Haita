'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type HorrorMode = 'full' | 'reduced' | 'unset';

interface HorrorContextValue {
  mode: HorrorMode;
  setMode: (m: 'full' | 'reduced') => void;
  /** true = jumpscares, possession, observer, scroll phantom are active */
  fullHorror: boolean;
  /** true = reduced motion or reduced mode */
  reducedMotion: boolean;
}

const HorrorContext = createContext<HorrorContextValue>({
  mode: 'unset',
  setMode: () => {},
  fullHorror: false,
  reducedMotion: false,
});

export function HorrorProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<HorrorMode>('unset');
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    // Read prefers-reduced-motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);

    // Read stored preference
    const stored = localStorage.getItem('haita-horror-mode') as HorrorMode | null;
    if (stored === 'full' || stored === 'reduced') {
      setModeState(stored);
    }

    return () => mq.removeEventListener('change', handler);
  }, []);

  function setMode(m: 'full' | 'reduced') {
    setModeState(m);
    localStorage.setItem('haita-horror-mode', m);
  }

  return (
    <HorrorContext.Provider
      value={{
        mode,
        setMode,
        fullHorror: mode === 'full' && !prefersReduced,
        reducedMotion: prefersReduced || mode === 'reduced',
      }}
    >
      {children}
    </HorrorContext.Provider>
  );
}

export function useHorror() {
  return useContext(HorrorContext);
}
