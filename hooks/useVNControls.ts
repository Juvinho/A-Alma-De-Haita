'use client';

import { useEffect, useCallback } from 'react';
import { useVNStore } from '@/stores/vn-store';
import { audioEngine } from '@/lib/vn/audio-engine';

export function useVNControls() {
  const state = useVNStore();
  const {
    advanceDialog,
    toggleMenu,
    toggleHistory,
    toggleAutoPlay,
    quickSave,
    quickLoad,
    toggleSkip,
    toggleSaveLoad,
  } = state;

  const {
    isMenuOpen,
    isSaveLoadOpen,
    isHistoryOpen,
    isStarted,
    isSkipping,
    isEnded,
    currentChoices,
  } = state;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Não processar se não começou
      if (!isStarted) return;

      // Se overlay está aberto, só Escape fecha
      if (isMenuOpen || isSaveLoadOpen || isHistoryOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          if (isHistoryOpen) useVNStore.getState().toggleHistory();
          else if (isSaveLoadOpen) useVNStore.getState().toggleSaveLoad('save');
          else useVNStore.getState().toggleMenu();
        }
        return;
      }

      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (!currentChoices || currentChoices.length === 0) {
            useVNStore.getState().advanceDialog();
            audioEngine.play('typewriter-tick');
          }
          break;

        case 'Escape':
          e.preventDefault();
          useVNStore.getState().toggleMenu();
          audioEngine.play('transition-whoosh');
          break;

        case 'ArrowUp':
        case 'PageUp':
        case 'h':
        case 'H':
          e.preventDefault();
          useVNStore.getState().toggleHistory();
          break;

        case 'a':
        case 'A':
          e.preventDefault();
          useVNStore.getState().toggleAutoPlay();
          audioEngine.play('choice-hover');
          break;

        case 's':
        case 'S':
          if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
            useVNStore.getState().quickSave();
            audioEngine.play('save-confirm');
          }
          break;

        case 'l':
        case 'L':
          if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
            useVNStore.getState().quickLoad();
            audioEngine.play('choice-select');
          }
          break;

        case 'Control':
        case 'Shift':
          // Segurar Shift = skip
          if (!isSkipping) {
            useVNStore.getState().toggleSkip();
          }
          break;
      }
    },
    [isStarted, isMenuOpen, isSaveLoadOpen, isHistoryOpen, currentChoices, isSkipping]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if ((e.key === 'Control' || e.key === 'Shift') && isSkipping) {
        useVNStore.getState().toggleSkip();
      }
    },
    [isSkipping]
  );

  // Click/tap para avançar
  const handleClick = useCallback(() => {
    if (!isStarted || isMenuOpen || isSaveLoadOpen || isHistoryOpen || isEnded) return;
    if (currentChoices && currentChoices.length > 0) return;
    useVNStore.getState().advanceDialog();
  }, [isStarted, isMenuOpen, isSaveLoadOpen, isHistoryOpen, isEnded, currentChoices]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { handleClick };
}
