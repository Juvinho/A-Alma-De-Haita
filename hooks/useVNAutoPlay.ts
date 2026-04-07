'use client';

import { useEffect, useRef } from 'react';
import { useVNStore } from '@/stores/vn-store';
import { audioEngine } from '@/lib/vn/audio-engine';

/**
 * Hook que gerencia auto-play e skip automático.
 *
 * - Auto-play: avança automaticamente após delay configurável
 * - Skip: avança rapidamente através de nodes já visitados
 */
export function useVNAutoPlay() {
  const isAutoPlay = useVNStore((s) => s.isAutoPlay);
  const isSkipping = useVNStore((s) => s.isSkipping);
  const isTyping = useVNStore((s) => s.isTyping);
  const currentChoices = useVNStore((s) => s.currentChoices);
  const isEnded = useVNStore((s) => s.isEnded);
  const isMenuOpen = useVNStore((s) => s.isMenuOpen);
  const autoPlayDelay = useVNStore((s) => s.settings.autoPlayDelay);
  const currentNodeId = useVNStore((s) => s.currentNodeId);
  const visitedNodes = useVNStore((s) => s.visitedNodes);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Limpar timer ao desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Auto-play
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!isAutoPlay || isTyping || isEnded || isMenuOpen) return;
    if (currentChoices && currentChoices.length > 0) return;

    timerRef.current = setTimeout(() => {
      useVNStore.getState().advanceDialog();
    }, autoPlayDelay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAutoPlay, isTyping, currentNodeId, isEnded, isMenuOpen, currentChoices, autoPlayDelay]);

  // Skip — avança rápido mas só em nodes já visitados
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!isSkipping || isEnded || isMenuOpen) return;
    if (currentChoices && currentChoices.length > 0) return;

    // Só skip em nodes já visitados
    const alreadyVisited = visitedNodes.has(currentNodeId);
    if (!alreadyVisited) return;

    // Skip rápido: completar texto imediatamente e avançar após delay curto
    if (isTyping) {
      useVNStore.getState().advanceDialog(); // Completa o texto
    }

    timerRef.current = setTimeout(() => {
      useVNStore.getState().advanceDialog(); // Avança para próximo
      audioEngine.play('typewriter-tick');
    }, 50); // 50ms entre nodes no skip

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isSkipping, isTyping, currentNodeId, isEnded, isMenuOpen, currentChoices, visitedNodes]);
}
