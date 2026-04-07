'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVNStore } from '@/stores/vn-store';
import { audioEngine } from '@/lib/vn/audio-engine';
import type { SaveSlot } from '@/types/vn';

const SLOTS_PER_PAGE = 8;
const TOTAL_PAGES = 3;

interface SlotProps {
  index: number;
  slot: SaveSlot | null;
  isSaveMode: boolean;
  onAction: (index: number) => void;
}

function SaveSlotCell({ index, slot, isSaveMode, onAction }: SlotProps) {
  const [hovering, setHovering] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (!slot && !isSaveMode) return; // can't load from empty slot
    if (slot && isSaveMode) {
      setConfirming(true); // confirm overwrite
    } else {
      onAction(index);
      audioEngine.play(isSaveMode ? 'save-confirm' : 'choice-select').catch(() => {});
    }
  };

  const date = slot ? new Date(slot.timestamp) : null;
  const dateStr = date
    ? `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    : null;

  return (
    <motion.div
      className="relative cursor-pointer"
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      onClick={handleClick}
      animate={{ y: hovering ? -2 : 0 }}
      transition={{ duration: 0.15 }}
    >
      <div
        className="p-3 min-h-[90px] flex flex-col justify-between transition-all duration-150"
        style={{
          background: slot
            ? 'rgba(26,3,3,0.9)'
            : 'rgba(10,5,5,0.5)',
          border: `1px solid ${hovering ? 'var(--vn-border-gold)' : slot ? 'var(--vn-border-bronze)' : 'rgba(106,90,44,0.3)'}`,
          borderStyle: slot ? 'solid' : 'dashed',
          boxShadow: hovering ? '0 0 14px rgba(201,168,76,0.2)' : 'none',
        }}
      >
        {/* Slot number */}
        <div className="flex items-center justify-between mb-1">
          <span
            className="font-cinzel text-xs"
            style={{ color: 'var(--vn-text-gold)', opacity: slot ? 1 : 0.4 }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          {slot && (
            <span className="font-cormorant text-xs" style={{ color: 'var(--vn-text-muted)' }}>
              {dateStr}
            </span>
          )}
        </div>

        {slot ? (
          <>
            <p className="font-cinzel text-xs uppercase tracking-wider truncate" style={{ color: 'var(--vn-text-cream)' }}>
              {slot.chapterTitle || `Cap. ${slot.chapterId}`}
            </p>
            <p className="font-cormorant text-xs truncate mt-0.5" style={{ color: 'var(--vn-text-dim)' }}>
              {slot.history[slot.history.length - 1]?.text?.slice(0, 60) ?? '—'}
            </p>
          </>
        ) : (
          <p
            className="font-cormorant italic text-xs"
            style={{ color: 'var(--vn-text-muted)', opacity: 0.5 }}
          >
            — vazio —
          </p>
        )}
      </div>

      {/* Confirmation overlay */}
      <AnimatePresence>
        {confirming && (
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: 'rgba(20,3,3,0.95)', border: '1px solid var(--vn-border-gold)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="font-cormorant text-xs" style={{ color: 'var(--vn-text-cream)' }}>
              Sobrescrever?
            </p>
            <div className="flex gap-2">
              <button
                className="font-cinzel text-xs px-3 py-1"
                style={{ border: '1px solid var(--vn-border-gold)', color: 'var(--vn-text-gold)' }}
                onClick={() => {
                  setConfirming(false);
                  onAction(index);
                  audioEngine.play('save-confirm').catch(() => {});
                }}
              >
                Sim
              </button>
              <button
                className="font-cinzel text-xs px-3 py-1"
                style={{ border: '1px solid var(--vn-border-gold-dim)', color: 'var(--vn-text-muted)' }}
                onClick={() => setConfirming(false)}
              >
                Não
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function VNSaveLoad() {
  const isSaveLoadOpen = useVNStore((s) => s.isSaveLoadOpen);
  const isSaveMode = useVNStore((s) => s.isSaveMode);
  const saves = useVNStore((s) => s.saves);
  const [page, setPage] = useState(0);

  const slotOffset = page * SLOTS_PER_PAGE;
  const pageSlots = saves.slice(slotOffset, slotOffset + SLOTS_PER_PAGE);

  const handleAction = (localIndex: number) => {
    const globalIndex = slotOffset + localIndex;
    if (isSaveMode) {
      useVNStore.getState().saveToSlot(globalIndex);
    } else {
      useVNStore.getState().loadFromSlot(globalIndex);
      useVNStore.getState().toggleSaveLoad('load');
    }
  };

  const handleClose = () => {
    useVNStore.getState().toggleSaveLoad(isSaveMode ? 'save' : 'load');
  };

  return (
    <AnimatePresence>
      {isSaveLoadOpen && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ background: 'rgba(5,0,0,0.9)' }}
          onClick={handleClose}
        >
          <motion.div
            className="w-full max-w-2xl mx-4"
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-3 mb-4"
              style={{ borderBottom: '1px solid var(--vn-border-gold-dim)' }}
            >
              {/* Tabs */}
              <div className="flex gap-1">
                {(['save', 'load'] as const).map((mode) => (
                  <button
                    key={mode}
                    className="font-cinzel text-xs uppercase tracking-widest px-4 py-2 transition-all duration-150"
                    style={{
                      background:
                        (mode === 'save') === isSaveMode
                          ? 'rgba(42,5,5,0.9)'
                          : 'rgba(15,3,3,0.7)',
                      border: `1px solid ${(mode === 'save') === isSaveMode ? 'var(--vn-border-gold)' : 'var(--vn-border-gold-dim)'}`,
                      color: (mode === 'save') === isSaveMode ? 'var(--vn-text-gold)' : 'var(--vn-text-muted)',
                      clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
                    }}
                    onClick={() => useVNStore.getState().toggleSaveLoad(mode)}
                  >
                    {mode === 'save' ? 'Salvar' : 'Carregar'}
                  </button>
                ))}
              </div>

              <button
                className="font-cinzel text-xs uppercase tracking-widest px-3 py-1.5 transition-opacity hover:opacity-100 opacity-60"
                style={{
                  border: '1px solid var(--vn-border-gold-dim)',
                  color: 'var(--vn-text-cream)',
                  background: 'rgba(42,5,5,0.5)',
                  clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)',
                }}
                onClick={handleClose}
              >
                Fechar
              </button>
            </div>

            {/* Slot grid 2×4 */}
            <div className="grid grid-cols-2 gap-2 px-4 mb-4">
              {pageSlots.map((slot, localIdx) => (
                <SaveSlotCell
                  key={slotOffset + localIdx}
                  index={localIdx}
                  slot={slot}
                  isSaveMode={isSaveMode}
                  onAction={handleAction}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 pb-4">
              {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
                <button
                  key={i}
                  className="font-cinzel text-xs uppercase tracking-widest px-3 py-1.5 transition-all duration-150"
                  style={{
                    background: page === i ? 'rgba(42,5,5,0.9)' : 'rgba(15,3,3,0.6)',
                    border: `1px solid ${page === i ? 'var(--vn-border-gold)' : 'var(--vn-border-gold-dim)'}`,
                    color: page === i ? 'var(--vn-text-gold)' : 'var(--vn-text-muted)',
                    clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)',
                  }}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
