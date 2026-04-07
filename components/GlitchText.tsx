'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  text: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  intensity?: 'low' | 'medium' | 'high';
}

export default function GlitchText({
  text,
  className,
  tag: Tag = 'span',
  intensity = 'medium',
}: GlitchTextProps) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const intervals: Record<string, number> = { low: 8000, medium: 5000, high: 2500 };
    const durations: Record<string, number> = { low: 150, medium: 300, high: 500 };

    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), durations[intensity]);
    }, intervals[intensity] + Math.random() * 3000);

    return () => clearInterval(interval);
  }, [intensity]);

  return (
    <Tag
      className={cn('relative inline-block', glitching && 'glitch-text', className)}
      data-text={text}
    >
      {text}
    </Tag>
  );
}
