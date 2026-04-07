'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AudioEngine } from '@/lib/audio-engine';

interface AudioContextValue {
  engine: AudioEngine | null;
  active: boolean;
  toggle: () => Promise<void>;
}

const AudioCtx = createContext<AudioContextValue>({
  engine: null,
  active: false,
  toggle: async () => {},
});

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const engineRef = useRef<AudioEngine | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    engineRef.current = new AudioEngine();

    // Check stored preference
    const stored = localStorage.getItem('haita-audio');
    // Never autoplay — even if stored, wait for click
    // We just prepare the engine

    return () => {
      engineRef.current?.destroy();
    };
  }, []);

  async function toggle() {
    const eng = engineRef.current;
    if (!eng) return;

    if (!eng.isEnabled()) {
      const ok = await eng.init();
      if (ok) {
        eng.startWhispers(0);
        setActive(true);
        localStorage.setItem('haita-audio', '1');
      }
    } else if (active) {
      eng.mute();
      setActive(false);
      localStorage.setItem('haita-audio', '0');
    } else {
      eng.unmute();
      setActive(true);
      localStorage.setItem('haita-audio', '1');
    }
  }

  return (
    <AudioCtx.Provider value={{ engine: engineRef.current, active, toggle }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  return useContext(AudioCtx);
}
