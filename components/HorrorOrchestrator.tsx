'use client';

/**
 * HorrorOrchestrator: Central component that ties the corruption system,
 * audio engine, and presence effects together with a single global state.
 *
 * Mounted once in layout.tsx. Listens to custom DOM events dispatched
 * from EnigmaInput so we don't need to thread props down.
 */

import { useEffect, useRef, useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';
import { useCorruption } from '@/hooks/useCorruption';
import HaitaPresence from '@/components/HaitaPresence';
import HaitaAwareness from '@/components/HaitaAwareness';
import HaitaMicroHorror from '@/components/HaitaMicroHorror';
import DynamicFavicon from '@/components/DynamicFavicon';

export default function HorrorOrchestrator() {
  const { engine } = useAudio();
  const { corruption, onWrongAnswer, onCorrectAnswer, onHintUsed } = useCorruption();
  const [wrongCount, setWrongCount] = useState(0);
  const prevLevel = useRef(0);

  // Listen to enigma events
  useEffect(() => {
    function onWrong() {
      onWrongAnswer();
      setWrongCount((c) => c + 1);
      engine?.effects?.playWrong();
    }
    function onCorrect() {
      onCorrectAnswer();
      engine?.effects?.playCorrect();
    }
    function onHint() {
      onHintUsed();
      engine?.effects?.playMercy();
    }
    function onVeilOpen() {
      engine?.effects?.playVeilOpen();
    }
    function onUnlock() {
      engine?.effects?.playUnlock();
    }
    function onParousia() {
      engine?.setParousia();
    }
    function onHover(e: Event) {
      if (engine?.isEnabled()) engine.effects?.playHover();
    }
    function onClick(e: Event) {
      if (engine?.isEnabled()) engine.effects?.playClick();
    }

    window.addEventListener('haita-wrong', onWrong);
    window.addEventListener('haita-correct', onCorrect);
    window.addEventListener('haita-hint', onHint);
    window.addEventListener('haita-veil-open', onVeilOpen);
    window.addEventListener('haita-unlock', onUnlock);
    window.addEventListener('haita-parousia', onParousia);

    // Subtle hover/click sounds on interactive elements
    document.addEventListener('mouseover', onHover);

    return () => {
      window.removeEventListener('haita-wrong', onWrong);
      window.removeEventListener('haita-correct', onCorrect);
      window.removeEventListener('haita-hint', onHint);
      window.removeEventListener('haita-veil-open', onVeilOpen);
      window.removeEventListener('haita-unlock', onUnlock);
      window.removeEventListener('haita-parousia', onParousia);
      document.removeEventListener('mouseover', onHover);
    };
  }, [engine, onWrongAnswer, onCorrectAnswer, onHintUsed]);

  // Sync corruption level to audio engine
  useEffect(() => {
    if (!engine?.isEnabled()) return;
    if (corruption.level !== prevLevel.current) {
      engine.setCorruption(corruption.level);
      prevLevel.current = corruption.level;
    }
  }, [engine, corruption.level]);

  // Apply corruption CSS variables to root
  useEffect(() => {
    const vars = {
      '--corruption-level': `${corruption.level}`,
      '--grain-intensity': `${corruption.grainIntensity}`,
    };
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [corruption]);

  return (
    <>
      <DynamicFavicon />
      <HaitaPresence
        corruptionLevel={corruption.level}
        wrongAnswerCount={wrongCount}
      />
      <HaitaAwareness />
      <HaitaMicroHorror />
    </>
  );
}
