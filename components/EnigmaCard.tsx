'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Enigma } from '@/data/enigmas';
import { CATEGORIA_LABELS } from '@/data/enigmas';

interface EnigmaCardProps {
  enigma: Enigma;
  completed: boolean;
  locked: boolean;
  index: number;
}

const categoryIcons: Record<Enigma['categoria'], string> = {
  logica: '⟁',
  linguistica: '◈',
  mitologica: '✦',
  cifra: '⊕',
  observacao: '⊗',
};

export default function EnigmaCard({ enigma, completed, locked, index }: EnigmaCardProps) {
  const content = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      whileHover={!locked ? { scale: 1.03, y: -2 } : {}}
      className={cn(
        'relative border p-5 transition-all duration-300 group',
        'font-body',
        completed
          ? 'border-[var(--accent-gold)] bg-[#0d0d00] veu-complete'
          : locked
          ? 'border-[#2a2a2a] bg-[#0d0d0d] veu-locked cursor-not-allowed'
          : 'border-[var(--accent-blood)] bg-[#0f0505] hover:border-[var(--accent-crimson)] cursor-pointer'
      )}
    >
      {/* Corner decorations */}
      <span className="absolute top-1 left-1 text-[0.5rem] text-[var(--accent-crimson)] opacity-50">✦</span>
      <span className="absolute bottom-1 right-1 text-[0.5rem] text-[var(--accent-crimson)] opacity-50">✦</span>

      {/* Category icon */}
      <div className="flex items-start justify-between mb-3">
        <span
          className={cn(
            'text-xl',
            completed ? 'text-[var(--accent-gold)]' : locked ? 'text-gray-600' : 'text-[var(--accent-crimson)]'
          )}
        >
          {categoryIcons[enigma.categoria]}
        </span>
        <span
          className={cn(
            'font-mono text-xs uppercase tracking-widest',
            completed ? 'text-[var(--accent-gold)]' : locked ? 'text-gray-600' : 'text-[var(--text-secondary)]'
          )}
        >
          {CATEGORIA_LABELS[enigma.categoria]}
        </span>
      </div>

      {/* Title */}
      <h3
        className={cn(
          'font-display text-sm mb-2 tracking-wide',
          completed ? 'text-[var(--accent-gold)]' : locked ? 'text-gray-600' : 'text-[var(--text-primary)]',
          !locked && 'group-hover:text-[var(--accent-crimson)] transition-colors'
        )}
      >
        {locked ? '— SELADO —' : enigma.titulo}
      </h3>

      {/* Status */}
      <div className="mt-auto">
        {completed ? (
          <span className="font-mono text-xs text-[var(--accent-gold)] tracking-widest">
            ✓ VÉU RASGADO
          </span>
        ) : locked ? (
          <span className="font-mono text-xs text-gray-600 tracking-widest">
            ⛒ BLOQUEADO
          </span>
        ) : (
          <span className="font-mono text-xs text-[var(--accent-blood)] tracking-widest group-hover:text-[var(--accent-crimson)] transition-colors">
            ▶ ENTRAR
          </span>
        )}
      </div>

      {/* Hover glow */}
      {!locked && !completed && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{ boxShadow: 'inset 0 0 20px #8b000015' }} />
      )}
    </motion.div>
  );

  if (locked) return content;

  return (
    <Link href={`/enigma/${enigma.id}`} className="block">
      {content}
    </Link>
  );
}
