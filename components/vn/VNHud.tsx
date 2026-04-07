'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useVNStore } from '@/stores/vn-store';
import { audioEngine } from '@/lib/vn/audio-engine';

export function VNHud() {
  const chapterTitle = useVNStore((s) => s.chapterTitle);
  const isAutoPlay = useVNStore((s) => s.isAutoPlay);
  const isSkipping = useVNStore((s) => s.isSkipping);
  const isMenuOpen = useVNStore((s) => s.isMenuOpen);
  const isStarted = useVNStore((s) => s.isStarted);

  if (!isStarted || isMenuOpen) return null;

  return (
    <>
      {/* Chapter title — top left */}
      <div className="absolute top-4 left-5 z-20 pointer-events-none">
        <p
          className="font-cinzel text-xs uppercase tracking-[0.25em] opacity-60"
          style={{ color: 'var(--vn-text-gold)' }}
        >
          {chapterTitle}
        </p>
      </div>

      {/* Menu button — top right */}
      <button
        className="absolute top-3 right-4 z-20 px-3 py-1.5 font-cinzel text-xs uppercase tracking-widest transition-all duration-200 hover:opacity-100 opacity-70"
        style={{
          background: 'rgba(20,5,5,0.75)',
          border: '1px solid var(--vn-border-gold-dim)',
          color: 'var(--vn-text-gold)',
          clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
        }}
        onClick={() => {
          audioEngine.play('transition-whoosh').catch(() => {});
          useVNStore.getState().toggleMenu();
        }}
      >
        ☰
      </button>

      {/* Status badges — top center */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 pointer-events-none">
        <AnimatePresence>
          {isAutoPlay && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="font-cinzel text-xs px-2 py-0.5"
              style={{
                background: 'rgba(42,5,5,0.85)',
                border: '1px solid var(--vn-border-gold-dim)',
                color: 'var(--vn-text-gold)',
              }}
            >
              AUTO
            </motion.span>
          )}
          {isSkipping && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="font-cinzel text-xs px-2 py-0.5"
              style={{
                background: 'rgba(42,5,5,0.85)',
                border: '1px solid var(--vn-border-gold-dim)',
                color: 'var(--vn-text-dim)',
              }}
            >
              SKIP
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
