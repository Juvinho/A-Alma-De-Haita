'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface WhisperTextProps {
  text: string;
  className?: string;
  delay?: number;        // ms before starting
  speed?: number;        // ms per character
  onComplete?: () => void;
  italic?: boolean;
}

export default function WhisperText({
  text,
  className,
  delay = 0,
  speed = 40,
  onComplete,
  italic = true,
}: WhisperTextProps) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) {
      setDone(true);
      onComplete?.();
      return;
    }

    const t = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed + Math.random() * 20);

    return () => clearTimeout(t);
  }, [started, displayed, text, speed, onComplete]);

  return (
    <span
      className={cn(
        'font-body text-[var(--text-primary)]',
        italic && 'italic',
        className
      )}
    >
      {displayed}
      {!done && started && (
        <span className="inline-block w-0.5 h-5 bg-[var(--accent-crimson)] ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
}
