'use client';

import { cn } from '@/lib/utils';

const RUNES = ['ᚻ', 'ᚪ', 'ᛁ', 'ᛏ', 'ᚸ', 'ᚹ', 'ᛖ', 'ᛚ', 'ᛗ', 'ᚩ', 'ᛞ', '✦', '⊕', '⊗', '✧', '⬡', '◈', '⟁'];

interface RuneSymbolProps {
  index?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'text-base',
  md: 'text-2xl',
  lg: 'text-4xl',
  xl: 'text-6xl',
};

export default function RuneSymbol({
  index,
  size = 'md',
  animate = false,
  className,
}: RuneSymbolProps) {
  const rune = RUNES[index !== undefined ? index % RUNES.length : 0];

  return (
    <span
      className={cn(
        'text-[var(--accent-crimson)] opacity-60 select-none',
        sizeMap[size],
        animate && 'animate-pulse-slow',
        className
      )}
      aria-hidden="true"
    >
      {rune}
    </span>
  );
}

export function RuneRow({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-3 justify-center', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <RuneSymbol key={i} index={i} size="sm" />
      ))}
    </div>
  );
}

export function RuneSeparator() {
  return (
    <div className="flex items-center gap-4 my-6">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--accent-blood)]" />
      <RuneSymbol index={7} size="sm" />
      <RuneSymbol index={0} size="md" />
      <RuneSymbol index={7} size="sm" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--accent-blood)]" />
    </div>
  );
}
