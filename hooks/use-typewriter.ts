'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UseTypewriterOptions {
  text: string;
  speed?: number;
  startDelay?: number;
  glitchProbability?: number;
  onComplete?: () => void;
  enabled?: boolean;
}

export interface UseTypewriterReturn {
  displayedText: string;
  isTyping: boolean;
  isComplete: boolean;
  reset: () => void;
}

const GLITCH_CHARS = '█░▓▒╬╫╪';

export function useTypewriter({
  text,
  speed = 50,
  startDelay = 0,
  glitchProbability = 0.05,
  onComplete,
  enabled = true,
}: UseTypewriterOptions): UseTypewriterReturn {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [glitchedChar, setGlitchedChar] = useState<{
    index: number;
    char: string;
  } | null>(null);

  const reset = useCallback(() => {
    setDisplayedText('');
    setIsTyping(false);
    setIsComplete(false);
    setGlitchedChar(null);
  }, []);

  useEffect(() => {
    if (!enabled || !text) return;

    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const startTyping = () => {
      setIsTyping(true);
      let currentIndex = 0;

      const typeCharacter = () => {
        if (currentIndex >= text.length) {
          setIsTyping(false);
          setIsComplete(true);
          setGlitchedChar(null);
          onComplete?.();
          return;
        }

        const shouldGlitch = Math.random() < glitchProbability;

        if (shouldGlitch) {
          const glitchChar = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          setGlitchedChar({ index: currentIndex, char: glitchChar });

          const glitchTimeout = setTimeout(() => {
            setDisplayedText(text.substring(0, currentIndex + 1));
            setGlitchedChar(null);
            currentIndex++;
            intervalId = setTimeout(typeCharacter, speed);
          }, 80);

          return;
        }

        setDisplayedText(text.substring(0, currentIndex + 1));
        setGlitchedChar(null);
        currentIndex++;
        intervalId = setTimeout(typeCharacter, speed);
      };

      typeCharacter();
    };

    if (startDelay > 0) {
      timeoutId = setTimeout(startTyping, startDelay);
    } else {
      startTyping();
    }

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(intervalId);
    };
  }, [text, speed, startDelay, glitchProbability, enabled, onComplete]);

  const finalDisplayText =
    glitchedChar && glitchedChar.index === displayedText.length
      ? displayedText + glitchedChar.char
      : displayedText;

  return {
    displayedText: finalDisplayText,
    isTyping,
    isComplete,
    reset,
  };
}