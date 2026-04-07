'use client';

import { useEffect, useRef, useState } from 'react';
import { formatCountdown, VARGUËN_DATE } from '@/lib/utils';

export default function Countdown() {
  const [display, setDisplay] = useState('');
  const [glitching, setGlitching] = useState(false);
  const lastGlitch = useRef(0);

  useEffect(() => {
    function update() {
      setDisplay(formatCountdown(VARGUËN_DATE));
    }

    update();
    const interval = setInterval(update, 1000);

    // Broken clock: every ~10 minutes, race the numbers for 2s
    const glitchInterval = setInterval(() => {
      const now = Date.now();
      if (now - lastGlitch.current < 9 * 60 * 1000) return;
      if (Math.random() > 0.3) return; // not always

      lastGlitch.current = now;
      setGlitching(true);

      let frames = 0;
      const race = setInterval(() => {
        const fakeDate = new Date(VARGUËN_DATE.getTime() - Math.random() * 1e11);
        setDisplay(formatCountdown(fakeDate));
        frames++;
        if (frames > 20) {
          clearInterval(race);
          setDisplay(formatCountdown(VARGUËN_DATE));
          setGlitching(false);
        }
      }, 80);
    }, 60_000);

    return () => {
      clearInterval(interval);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <div
      className="countdown flex flex-col items-start gap-0.5"
      data-haita="o tempo é uma cortesia"
    >
      <span className="opacity-30 text-[0.6rem] uppercase tracking-widest">Varguën inaugura em</span>
      <span className={glitching ? 'text-[var(--accent-crimson)]' : ''}>
        {display}
      </span>
    </div>
  );
}
