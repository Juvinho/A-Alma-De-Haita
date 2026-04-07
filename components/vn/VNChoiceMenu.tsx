'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVNStore } from '@/stores/vn-store';
import { audioEngine } from '@/lib/vn/audio-engine';

export function VNChoiceMenu() {
  const currentChoices = useVNStore((s) => s.currentChoices);
  const isTyping = useVNStore((s) => s.isTyping);
  const isMenuOpen = useVNStore((s) => s.isMenuOpen);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!currentChoices || currentChoices.length === 0 || isTyping || isMenuOpen) return null;

  const handleChoiceClick = (index: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    audioEngine.play('choice-select').catch(() => {});
    setTimeout(() => {
      useVNStore.getState().makeChoice(index);
      setSelectedIndex(null);
    }, 500);
  };

  return (
    <div className="absolute inset-0 flex items-end justify-center pb-36 z-30 pointer-events-none">
      <div className="flex flex-col gap-3 w-full max-w-lg px-6 pointer-events-auto">
        <AnimatePresence>
          {currentChoices.map((choice, i) => (
            <motion.button
              key={`${choice.text}-${i}`}
              onClick={() => handleChoiceClick(i)}
              onMouseEnter={() => audioEngine.play('choice-hover').catch(() => {})}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: selectedIndex === null || selectedIndex === i ? 1 : 0.3, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, delay: i * 0.08 }}
              whileHover={selectedIndex === null ? { scale: 1.01 } : {}}
              className="group relative text-left w-full"
              style={{ outline: 'none' }}
            >
              <div
                className="px-6 py-3 font-cormorant text-base tracking-wide transition-all duration-200"
                style={{
                  background:
                    selectedIndex === i
                      ? 'linear-gradient(135deg, rgba(80,15,5,0.97) 0%, rgba(50,8,3,0.99) 100%)'
                      : 'linear-gradient(135deg, rgba(42,5,5,0.93) 0%, rgba(26,3,3,0.96) 100%)',
                  border: `1px solid ${selectedIndex === i ? 'var(--vn-border-gold-bright)' : 'var(--vn-border-gold-dim)'}`,
                  clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)',
                  color: selectedIndex === i ? 'var(--vn-text-gold)' : 'var(--vn-text-cream)',
                  boxShadow: selectedIndex === i
                    ? '0 0 16px rgba(201,168,76,0.25), inset 0 1px 0 rgba(201,168,76,0.2)'
                    : '0 2px 12px rgba(0,0,0,0.4)',
                  cursor: selectedIndex !== null ? 'default' : 'pointer',
                }}
              >
                {/* Accent left bar */}
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-0.5 h-4 transition-all duration-200"
                  style={{
                    background: selectedIndex === i ? 'var(--vn-border-gold)' : 'var(--vn-border-gold-dim)',
                  }}
                />
                <span className="pl-3">{choice.text}</span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
