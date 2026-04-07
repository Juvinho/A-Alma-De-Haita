'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useVNStore } from '@/stores/vn-store';
import { VNNamePlate } from './VNNamePlate';
import { VNTextRenderer } from './VNTextRenderer';
import type { CharacterId } from '@/types/vn';

export function VNDialogBox() {
  const currentText = useVNStore((s) => s.currentText);
  const currentSpeaker = useVNStore((s) => s.currentSpeaker);
  const isTyping = useVNStore((s) => s.isTyping);
  const currentChoices = useVNStore((s) => s.currentChoices);
  const isEnded = useVNStore((s) => s.isEnded);
  const isMenuOpen = useVNStore((s) => s.isMenuOpen);
  const isSaveLoadOpen = useVNStore((s) => s.isSaveLoadOpen);
  const isHistoryOpen = useVNStore((s) => s.isHistoryOpen);

  const setTypingDone = useCallback(() => {
    useVNStore.getState().updateSettings({}); // no-op to trigger re-render
    useVNStore.setState({ isTyping: false });
  }, []);

  const hasChoices = currentChoices && currentChoices.length > 0;
  const isOverlayOpen = isMenuOpen || isSaveLoadOpen || isHistoryOpen;

  if (!currentText || isEnded || isOverlayOpen) return null;

  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Dialog container */}
      <div
        className="relative mx-4 mb-4"
        style={{
          background: 'linear-gradient(135deg, rgba(42,5,5,0.92) 0%, rgba(26,3,3,0.95) 100%)',
          border: '1px solid var(--vn-border-gold)',
          borderRadius: '4px',
          padding: '20px 28px 16px',
          boxShadow: '0 -4px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(201,168,76,0.15)',
          minHeight: '120px',
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, var(--vn-border-gold), transparent)' }}
        />

        {/* Name plate */}
        <VNNamePlate speaker={currentSpeaker as CharacterId | null} />

        {/* Text */}
        <VNTextRenderer
          key={currentText}
          text={currentText}
          isNarration={!currentSpeaker}
          onTypingComplete={setTypingDone}
        />

        {/* Advance indicator — only when text is done and no choices */}
        {!isTyping && !hasChoices && (
          <motion.div
            className="absolute bottom-3 right-5"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div
              className="w-0 h-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '8px solid var(--vn-border-gold)',
              }}
            />
          </motion.div>
        )}

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px opacity-30"
          style={{ background: 'linear-gradient(90deg, transparent, var(--vn-border-gold-dim), transparent)' }}
        />
      </div>
    </motion.div>
  );
}
