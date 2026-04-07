'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVNStore } from '@/stores/vn-store';
import { characters } from '@/data/vn/sprites';
import type { CharacterId } from '@/types/vn';

export function VNHistoryLog() {
  const isHistoryOpen = useVNStore((s) => s.isHistoryOpen);
  const history = useVNStore((s) => s.history);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll para o final quando abre
  useEffect(() => {
    if (isHistoryOpen && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }
  }, [isHistoryOpen]);

  return (
    <AnimatePresence>
      {isHistoryOpen && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ background: 'rgba(5,0,0,0.93)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-8 py-4 shrink-0"
            style={{ borderBottom: '1px solid var(--vn-border-gold-dim)' }}
          >
            <h2
              className="font-cinzel text-base uppercase tracking-[0.3em]"
              style={{ color: 'var(--vn-text-gold)' }}
            >
              Histórico
            </h2>
            <button
              className="font-cinzel text-xs uppercase tracking-widest px-3 py-1.5 transition-opacity hover:opacity-100 opacity-70"
              style={{
                border: '1px solid var(--vn-border-gold-dim)',
                color: 'var(--vn-text-cream)',
                background: 'rgba(42,5,5,0.7)',
                clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
              }}
              onClick={() => useVNStore.getState().toggleHistory()}
            >
              Fechar
            </button>
          </div>

          {/* Log scroll area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
            {history.length === 0 && (
              <p
                className="font-cormorant italic text-center opacity-40"
                style={{ color: 'var(--vn-text-cream)' }}
              >
                Nenhum diálogo ainda.
              </p>
            )}
            {history.map((entry, i) => {
              const cfg = entry.speaker ? characters[entry.speaker as CharacterId] : null;
              return (
                <div key={i} className="space-y-0.5">
                  {cfg && (
                    <p
                      className="font-cinzel text-xs uppercase tracking-widest"
                      style={{ color: cfg.nameColor }}
                    >
                      {cfg.displayName}
                    </p>
                  )}
                  <p
                    className={`font-cormorant text-base leading-relaxed ${!cfg ? 'italic' : ''}`}
                    style={{ color: cfg ? 'var(--vn-text-cream)' : 'var(--vn-text-dim)' }}
                  >
                    {entry.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Decorative rune column on right */}
          <div
            className="absolute right-4 top-16 bottom-4 w-5 flex flex-col items-center gap-3 opacity-15 pointer-events-none"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="font-cinzel text-xs"
                style={{ color: 'var(--vn-text-gold)', fontSize: '10px' }}
              >
                {['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ'][i]}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
