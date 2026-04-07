'use client';

import { useState, useEffect, useCallback } from 'react';
import { PROVA_IDS } from '@/data/provas-meta';

export interface ProvaProgress {
  completed: boolean;
  bestTime?: number;        // seconds
  bestScore?: number;       // game-specific
  attempts: number;
  details?: Record<string, unknown>;
}

export interface AllProvaProgress {
  [provaId: string]: ProvaProgress;
}

const STORAGE_PREFIX = 'haita-prova-';

function loadProva(id: string): ProvaProgress {
  if (typeof window === 'undefined') {
    return { completed: false, attempts: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + id);
    if (raw) return JSON.parse(raw) as ProvaProgress;
  } catch {
    // ignore
  }
  return { completed: false, attempts: 0 };
}

function saveProva(id: string, data: ProvaProgress) {
  try {
    localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(data));
  } catch {
    // ignore
  }
}

function loadAll(): AllProvaProgress {
  const all: AllProvaProgress = {};
  for (const id of PROVA_IDS) {
    all[id] = loadProva(id);
  }
  return all;
}

export function useProvaProgress() {
  const [all, setAll] = useState<AllProvaProgress>(() => {
    // Return empty defaults for SSR; hydrate in useEffect
    return Object.fromEntries(PROVA_IDS.map((id) => [id, { completed: false, attempts: 0 }]));
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setAll(loadAll());
    setLoaded(true);
  }, []);

  const getProva = useCallback((id: string): ProvaProgress => all[id] ?? { completed: false, attempts: 0 }, [all]);

  const completeProva = useCallback(
    (
      id: string,
      opts: { time?: number; score?: number; details?: Record<string, unknown> } = {}
    ) => {
      setAll((prev) => {
        const existing = prev[id] ?? { completed: false, attempts: 0 };
        const updated: ProvaProgress = {
          ...existing,
          completed: true,
          attempts: existing.attempts + 1,
          bestTime:
            opts.time !== undefined
              ? existing.bestTime !== undefined
                ? Math.min(existing.bestTime, opts.time)
                : opts.time
              : existing.bestTime,
          bestScore:
            opts.score !== undefined
              ? existing.bestScore !== undefined
                ? Math.max(existing.bestScore, opts.score)
                : opts.score
              : existing.bestScore,
          details: opts.details ?? existing.details,
        };
        saveProva(id, updated);

        // Apply corruption reward: -15
        try {
          const raw = localStorage.getItem('haita-corruption');
          const current = raw ? parseInt(raw, 10) : 0;
          const next = Math.max(0, current - 15);
          localStorage.setItem('haita-corruption', next.toString());
        } catch {
          // ignore
        }

        return { ...prev, [id]: updated };
      });
    },
    []
  );

  const recordAttempt = useCallback((id: string) => {
    setAll((prev) => {
      const existing = prev[id] ?? { completed: false, attempts: 0 };
      const updated: ProvaProgress = {
        ...existing,
        attempts: existing.attempts + 1,
      };
      saveProva(id, updated);
      return { ...prev, [id]: updated };
    });
  }, []);

  const updateDetails = useCallback(
    (id: string, details: Record<string, unknown>) => {
      setAll((prev) => {
        const existing = prev[id] ?? { completed: false, attempts: 0 };
        const updated: ProvaProgress = { ...existing, details };
        saveProva(id, updated);
        return { ...prev, [id]: updated };
      });
    },
    []
  );

  const completedCount = PROVA_IDS.filter((id) => all[id]?.completed).length;
  const allComplete = completedCount >= 8;

  const stats = {
    completedCount,
    allComplete,
    bestLabyrinthTime: all['p1']?.bestTime,
    bestEcosScore: all['p2']?.bestScore,
    bestBridgeDeaths: all['p3']?.details?.deaths as number | undefined,
    shadowsFound: all['p5']?.details?.totalFound as number | undefined,
    wordTyped: all['p6']?.bestScore,
    mayaEndings: all['p7']?.details?.endings as string[] | undefined,
    mirrorLevels: all['p8']?.bestScore,
  };

  useEffect(() => {
    if (!loaded || typeof window === 'undefined') return;
    localStorage.setItem('haita-proved', stats.allComplete ? 'true' : 'false');
  }, [loaded, stats.allComplete]);

  return {
    all,
    loaded,
    getProva,
    completeProva,
    recordAttempt,
    updateDetails,
    stats,
  };
}
