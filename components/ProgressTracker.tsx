'use client';

import { cn } from '@/lib/utils';
import { useProgress } from '@/hooks/useProgress';

interface ProgressTrackerProps {
  className?: string;
  showName?: boolean;
}

export default function ProgressTracker({ className, showName = true }: ProgressTrackerProps) {
  const { progress } = useProgress();
  const completed = progress.completedEnigmas.length;
  const total = 20;
  const pct = Math.round((completed / total) * 100);

  return (
    <div className={cn('font-mono text-xs text-[var(--text-secondary)]', className)}>
      {showName && progress.eloName && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[var(--accent-crimson)]">⛓</span>
          <span className="text-[var(--text-primary)] font-medium tracking-wider uppercase text-xs">
            {progress.eloName}
          </span>
        </div>
      )}
      <div className="flex items-center gap-3">
        <span className="text-[var(--accent-gold)]">{completed}</span>
        <span className="opacity-40">/</span>
        <span>{total}</span>
        <span className="opacity-40 ml-1">véus rasgados</span>
      </div>
      <div className="mt-1.5 h-0.5 w-32 bg-[var(--accent-blood)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--accent-gold)] transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
