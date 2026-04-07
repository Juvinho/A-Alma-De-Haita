'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { characters } from '@/data/vn/sprites';
import type { CharacterId } from '@/types/vn';

interface VNNamePlateProps {
  speaker: CharacterId | null;
}

export function VNNamePlate({ speaker }: VNNamePlateProps) {
  const cfg = speaker ? characters[speaker] : null;

  return (
    <AnimatePresence mode="wait">
      {cfg && (
        <motion.div
          key={speaker}
          className="absolute -top-9 left-0"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="px-5 py-1.5 font-cinzel text-sm uppercase tracking-widest"
            style={{
              backgroundColor: cfg.nameBgColor,
              color: cfg.nameColor,
              border: `1px solid var(--vn-border-gold)`,
              clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 100%, 0 100%)',
              paddingRight: '2rem',
              boxShadow: 'var(--vn-glow-crimson)',
              letterSpacing: '0.2em',
            }}
          >
            {cfg.displayName}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
