'use client';

import { useState, useEffect, useCallback } from 'react';

export interface PlayerProgress {
  eloName: string;
  completedEnigmas: string[];       // array of enigma IDs completed
  hintsUsed: Record<string, number>; // enigmaId -> number of hints used
  totalHints: number;
}

const STORAGE_KEY = 'haita_progress';

const defaultProgress: PlayerProgress = {
  eloName: '',
  completedEnigmas: [],
  hintsUsed: {},
  totalHints: 0,
};

export function useProgress() {
  const [progress, setProgress] = useState<PlayerProgress>(defaultProgress);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
    setLoaded(true);
  }, []);

  const save = useCallback((next: PlayerProgress) => {
    setProgress(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  }, []);

  const setEloName = useCallback(
    (name: string) => {
      save({ ...progress, eloName: name });
    },
    [progress, save]
  );

  const completeEnigma = useCallback(
    (id: string) => {
      if (progress.completedEnigmas.includes(id)) return;
      save({
        ...progress,
        completedEnigmas: [...progress.completedEnigmas, id],
      });
    },
    [progress, save]
  );

  const useHint = useCallback(
    (enigmaId: string) => {
      const current = progress.hintsUsed[enigmaId] ?? 0;
      save({
        ...progress,
        hintsUsed: { ...progress.hintsUsed, [enigmaId]: current + 1 },
        totalHints: progress.totalHints + 1,
      });
      return current + 1;
    },
    [progress, save]
  );

  const isCompleted = useCallback(
    (id: string) => progress.completedEnigmas.includes(id),
    [progress]
  );

  const hintsForEnigma = useCallback(
    (id: string) => progress.hintsUsed[id] ?? 0,
    [progress]
  );

  const resetAll = useCallback(() => {
    save(defaultProgress);
  }, [save]);

  // Unlock logic: Véu N unlocks when at least 3/4 of Véu N-1 are complete
  const isNivelUnlocked = useCallback(
    (nivel: string) => {
      if (nivel === 'veu-1') return true;
      const nivelMap: Record<string, string> = {
        'veu-2': 'veu-1',
        'veu-3': 'veu-2',
        'veu-4': 'veu-3',
        'veu-5': 'veu-4',
      };
      const prevNivel = nivelMap[nivel];
      if (!prevNivel) return false;

      // Count completed enigmas in previous nivel
      // IDs follow pattern e01-e04 (veu-1), e05-e08 (veu-2), etc.
      const nivelToIds: Record<string, string[]> = {
        'veu-1': ['e01', 'e02', 'e03', 'e04'],
        'veu-2': ['e05', 'e06', 'e07', 'e08'],
        'veu-3': ['e09', 'e10', 'e11', 'e12'],
        'veu-4': ['e13', 'e14', 'e15', 'e16'],
        'veu-5': ['e17', 'e18', 'e19', 'e20'],
      };

      const prevIds = nivelToIds[prevNivel] ?? [];
      const completedCount = prevIds.filter((id) =>
        progress.completedEnigmas.includes(id)
      ).length;

      return completedCount >= 3;
    },
    [progress]
  );

  const allComplete = progress.completedEnigmas.length >= 20;

  return {
    progress,
    loaded,
    setEloName,
    completeEnigma,
    useHint,
    isCompleted,
    hintsForEnigma,
    isNivelUnlocked,
    allComplete,
    resetAll,
  };
}
