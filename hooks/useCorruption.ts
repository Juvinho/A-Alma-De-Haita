'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export type WhisperAggression = 'calm' | 'restless' | 'angry' | 'wrathful';

export interface CorruptionState {
  level: number;
  grainIntensity: number;
  glitchFrequency: number;
  particleSpeed: number;
  particleRedness: number;
  whisperAggression: WhisperAggression;
}

export interface UseCorruptionReturn {
  corruption: CorruptionState;
  onCorrectAnswer: () => void;
  onWrongAnswer: () => void;
  onHintUsed: () => void;
  reset: () => void;
  getCSSVariables: () => Record<string, string>;
}

const CORRUPTION_THRESHOLDS = {
  CALM: { min: 0, max: 20 },
  RESTLESS: { min: 21, max: 45 },
  ANGRY: { min: 46, max: 70 },
  WRATHFUL: { min: 71, max: 100 },
} as const;

const getAggression = (level: number): WhisperAggression => {
  if (level <= CORRUPTION_THRESHOLDS.CALM.max) return 'calm';
  if (level <= CORRUPTION_THRESHOLDS.RESTLESS.max) return 'restless';
  if (level <= CORRUPTION_THRESHOLDS.ANGRY.max) return 'angry';
  return 'wrathful';
};

const getStateFromLevel = (level: number): Partial<CorruptionState> => {
  const clamped = Math.max(0, Math.min(100, level));

  if (clamped <= CORRUPTION_THRESHOLDS.CALM.max) {
    return {
      grainIntensity: 0.05,
      glitchFrequency: 15000,
      particleSpeed: 0.7,
      particleRedness: 0.2,
      whisperAggression: 'calm',
    };
  }

  if (clamped <= CORRUPTION_THRESHOLDS.RESTLESS.max) {
    const progress = (clamped - CORRUPTION_THRESHOLDS.CALM.max) / 25;
    return {
      grainIntensity: 0.05 + progress * 0.1,
      glitchFrequency: 15000 - progress * 7000,
      particleSpeed: 0.7 + progress * 0.3,
      particleRedness: 0.2 + progress * 0.3,
      whisperAggression: 'restless',
    };
  }

  if (clamped <= CORRUPTION_THRESHOLDS.ANGRY.max) {
    const progress = (clamped - CORRUPTION_THRESHOLDS.RESTLESS.max) / 25;
    return {
      grainIntensity: 0.15 + progress * 0.15,
      glitchFrequency: 8000 - progress * 4000,
      particleSpeed: 1.0 + progress * 0.5,
      particleRedness: 0.5 + progress * 0.3,
      whisperAggression: 'angry',
    };
  }

  const progress = (clamped - CORRUPTION_THRESHOLDS.ANGRY.max) / 30;
  return {
    grainIntensity: 0.3 + progress * 0.2,
    glitchFrequency: 4000 - progress * 2000,
    particleSpeed: 1.5 + progress * 0.8,
    particleRedness: 0.8 + progress * 0.2,
    whisperAggression: 'wrathful',
  };
};

export function useCorruption(): UseCorruptionReturn {
  const [corruption, setCorruption] = useState<CorruptionState>(() => {
    if (typeof window === 'undefined') {
      return {
        level: 0,
        grainIntensity: 0.05,
        glitchFrequency: 15000,
        particleSpeed: 0.7,
        particleRedness: 0.2,
        whisperAggression: 'calm',
      };
    }

    const saved = localStorage.getItem('haita-corruption');
    const level = saved ? parseInt(saved, 10) : 0;

    return {
      level,
      ...getStateFromLevel(level),
    } as CorruptionState;
  });

  const decayTimeoutRef = useRef<NodeJS.Timeout>();

  const updateCorruption = useCallback((newLevel: number) => {
    const clamped = Math.max(0, Math.min(100, newLevel));

    setCorruption((prev) => ({
      ...prev,
      level: clamped,
      ...getStateFromLevel(clamped),
    }));

    if (typeof window !== 'undefined') {
      localStorage.setItem('haita-corruption', clamped.toString());
    }
  }, []);

  const onCorrectAnswer = useCallback(() => {
    updateCorruption(corruption.level - 8);
  }, [corruption.level, updateCorruption]);

  const onWrongAnswer = useCallback(() => {
    updateCorruption(corruption.level + 5);
  }, [corruption.level, updateCorruption]);

  const onHintUsed = useCallback(() => {
    updateCorruption(corruption.level + 2);
  }, [corruption.level, updateCorruption]);

  const reset = useCallback(() => {
    updateCorruption(0);
  }, [updateCorruption]);

  const getCSSVariables = useCallback((): Record<string, string> => {
    const shakeIntensity = Math.max(0, (corruption.level - 45) * 0.5);
    const bgTintAlpha = corruption.level / 300;

    return {
      '--corruption-grain': `${corruption.grainIntensity}`,
      '--corruption-glitch-interval': `${corruption.glitchFrequency}ms`,
      '--corruption-particle-speed': `${corruption.particleSpeed}`,
      '--corruption-particle-color': `rgba(${200 + corruption.particleRedness * 55}, ${30 + corruption.particleRedness * 20}, ${30 + corruption.particleRedness * 20}, ${0.6 + corruption.particleRedness * 0.3})`,
      '--corruption-shake-intensity': `${shakeIntensity}px`,
      '--corruption-bg-tint': `rgba(200, 50, 50, ${bgTintAlpha})`,
    };
  }, [corruption]);

  // Decay natural a cada 60 segundos
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const startDecay = () => {
      decayTimeoutRef.current = setTimeout(() => {
        setCorruption((prev) => {
          if (prev.level > 0) {
            const newLevel = Math.max(0, prev.level - 1);
            localStorage.setItem('haita-corruption', newLevel.toString());
            return {
              ...prev,
              level: newLevel,
              ...getStateFromLevel(newLevel),
            };
          }
          return prev;
        });
        startDecay();
      }, 60000);
    };

    startDecay();

    return () => {
      if (decayTimeoutRef.current) {
        clearTimeout(decayTimeoutRef.current);
      }
    };
  }, []);

  return {
    corruption,
    onCorrectAnswer,
    onWrongAnswer,
    onHintUsed,
    reset,
    getCSSVariables,
  };
}