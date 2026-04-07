'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { parseVNText } from '@/lib/vn/text-parser';
import { audioEngine } from '@/lib/vn/audio-engine';
import { useVNStore } from '@/stores/vn-store';

interface VNTextRendererProps {
  text: string;
  isNarration: boolean;
  onTypingComplete: () => void;
}

export function VNTextRenderer({ text, isNarration, onTypingComplete }: VNTextRendererProps) {
  const isTyping = useVNStore((s) => s.isTyping);
  const textSpeed = useVNStore((s) => s.settings.textSpeed);

  const [revealedCount, setRevealedCount] = useState(0);
  const [allChars, setAllChars] = useState<{ char: string; styles: ReturnType<typeof parseVNText>[0]['styles'] }[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseRef = useRef<number>(0);

  // Flatten the parsed segments into individual characters
  useEffect(() => {
    const segments = parseVNText(text);
    const chars: { char: string; styles: ReturnType<typeof parseVNText>[0]['styles'] }[] = [];
    for (const seg of segments) {
      for (const c of seg.text) {
        chars.push({ char: c, styles: seg.styles });
      }
    }
    setAllChars(chars);
    setRevealedCount(0);
  }, [text]);

  // Typewriter loop
  useEffect(() => {
    if (!isTyping) {
      // Reveal all immediately
      setRevealedCount(allChars.length);
      return;
    }

    if (revealedCount >= allChars.length) {
      onTypingComplete();
      return;
    }

    const currentChar = allChars[revealedCount];
    const speedMultiplier =
      currentChar?.styles.slow ? 2 :
      currentChar?.styles.fast ? 0.5 :
      1;
    const delay = pauseRef.current > 0
      ? pauseRef.current
      : textSpeed * speedMultiplier;

    pauseRef.current = 0;

    timerRef.current = setTimeout(() => {
      setRevealedCount((c) => c + 1);

      // Click sound every 3 chars (not spaces)
      if (currentChar && currentChar.char !== ' ' && revealedCount % 3 === 0) {
        audioEngine.play('typewriter-tick').catch(() => {});
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isTyping, revealedCount, allChars, textSpeed, onTypingComplete]);

  return (
    <p
      className={`font-cormorant text-lg leading-relaxed tracking-wide select-none ${
        isNarration ? 'italic' : ''
      }`}
      style={{ color: 'var(--vn-text-cream)', fontSize: '1.1rem' }}
    >
      {allChars.slice(0, revealedCount).map((c, i) => {
        const style: React.CSSProperties = {};
        if (c.styles.color) style.color = c.styles.color;

        const className = [
          c.styles.bold ? 'font-bold' : '',
          c.styles.italic ? 'italic' : '',
          c.styles.shake ? 'inline-block animate-vn-shake' : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <span key={i} className={className || undefined} style={Object.keys(style).length ? style : undefined}>
            {c.char}
          </span>
        );
      })}
      {/* Cursor piscante durante digitação */}
      {isTyping && revealedCount < allChars.length && (
        <motion.span
          className="inline-block w-0.5 h-4 ml-0.5 align-middle"
          style={{ backgroundColor: 'var(--vn-text-gold)' }}
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        />
      )}
    </p>
  );
}
