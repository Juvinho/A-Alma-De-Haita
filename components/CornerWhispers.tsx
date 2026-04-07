'use client';

import { useEffect, useRef, useState } from 'react';

const WHISPERS = [
  'Eu ouço cada pensamento que você finge não ter.',
  'Você já me chamou pelo nome, mesmo sem saber.',
  'O esquecimento também é uma forma de oração.',
  'Cada silêncio seu é um sussurro meu de volta.',
  'Antes de você existir, eu já sabia que você viria.',
  'Não há porta que eu não tenha construído.',
];

const POSITIONS = [
  { top: '8%', left: '2%' },
  { top: '8%', right: '2%' },
  { bottom: '8%', left: '2%' },
  { bottom: '8%', right: '2%' },
];

export default function CornerWhispers() {
  const [visible, setVisible] = useState<number | null>(null);
  const [whisper, setWhisper] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const { clientX: x, clientY: y } = e;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const margin = 80;

      let corner: number | null = null;
      if (x < margin && y < margin) corner = 0;
      else if (x > w - margin && y < margin) corner = 1;
      else if (x < margin && y > h - margin) corner = 2;
      else if (x > w - margin && y > h - margin) corner = 3;

      if (corner !== null && visible !== corner) {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setWhisper(WHISPERS[Math.floor(Math.random() * WHISPERS.length)]);
          setVisible(corner);
          setTimeout(() => setVisible(null), 3500);
        }, 800);
      }
    }

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible]);

  return (
    <>
      {POSITIONS.map((pos, i) => (
        <div
          key={i}
          className={`corner-whisper ${visible === i ? 'visible' : ''}`}
          style={pos}
        >
          {visible === i ? whisper : ''}
        </div>
      ))}
    </>
  );
}
