'use client';

import { motion } from 'framer-motion';
import { useAudio } from '@/contexts/AudioContext';

export default function AudioToggle() {
  const { active, toggle } = useAudio();

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3 }}
      onClick={toggle}
      title={active ? 'Desativar atmosfera sonora' : 'Ativar atmosfera sonora (recomendado)'}
      aria-label={active ? 'Desativar áudio' : 'Ativar áudio'}
      className="fixed top-4 right-4 z-50 w-8 h-8 flex items-center justify-center opacity-30 hover:opacity-70 transition-opacity"
    >
      {active ? (
        // Active: animated sound waves
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 7v6" stroke="#c9b99a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M7 4v12" stroke="#c9b99a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M11 6v8" stroke="#c9b99a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M15 8v4" stroke="#c9b99a" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ) : (
        // Muted: flat line with slash
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 10h14" stroke="#8a7a5a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M2 2l16 16" stroke="#8b0000" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
        </svg>
      )}
    </motion.button>
  );
}
