'use client';

import { useEffect, useCallback } from 'react';
import { useVNStore } from '@/stores/vn-store';
import { useVNControls } from '@/hooks/useVNControls';
import { useVNAutoPlay } from '@/hooks/useVNAutoPlay';
import { audioEngine } from '@/lib/vn/audio-engine';
import { story } from '@/data/story';

import { VNBackground } from './VNBackground';
import { VNSpritesLayer } from './VNSprite';
import { VNDialogBox } from './VNDialogBox';
import { VNChoiceMenu } from './VNChoiceMenu';
import { VNPauseMenu } from './VNPauseMenu';
import { VNSaveLoad } from './VNSaveLoad';
import { VNHistoryLog } from './VNHistoryLog';
import { VNHud } from './VNHud';
import { VNEndingScreen } from './VNEndingScreen';

export function VNEngine() {
  const { handleClick } = useVNControls();
  useVNAutoPlay();

  const isStarted = useVNStore((s) => s.isStarted);
  const currentNodeId = useVNStore((s) => s.currentNodeId);
  const currentSprites = useVNStore((s) => s.currentSprites);
  const currentSpeaker = useVNStore((s) => s.currentSpeaker);
  const isMenuOpen = useVNStore((s) => s.isMenuOpen);
  const isSaveLoadOpen = useVNStore((s) => s.isSaveLoadOpen);
  const isHistoryOpen = useVNStore((s) => s.isHistoryOpen);
  const isEnded = useVNStore((s) => s.isEnded);

  // Initialize audio on first render (will actually init on user interaction)
  useEffect(() => {
    audioEngine.init().catch(() => {});
  }, []);

  // Start ambient drone when game starts
  useEffect(() => {
    if (isStarted) {
      try { audioEngine.startDrone(); } catch { /* ignore */ }
    }
    return () => {
      try { audioEngine.stopDrone(); } catch { /* ignore */ }
    };
  }, [isStarted]);

  // Play sound effects defined in story nodes
  useEffect(() => {
    if (!isStarted) return;
    const node = story[currentNodeId];
    if (!node?.sound) return;

    const soundMap: Record<string, string> = {
      shake: 'shake-rumble',
      flash: 'flash-impact',
      heartbeat: 'heartbeat-single',
      wind: 'wind-gust',
    };

    const soundId = soundMap[node.sound];
    if (soundId) audioEngine.play(soundId as never).catch(() => {});
  }, [currentNodeId, isStarted]);

  // Determine sprite shake from current node
  const currentNode = story[currentNodeId];
  const shakePosition =
    currentNode?.spriteEffect?.effect === 'shake'
      ? currentNode.spriteEffect.position
      : null;

  const isAnyOverlayOpen = isMenuOpen || isSaveLoadOpen || isHistoryOpen;

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      onClick={handleClick}
      style={{ cursor: isAnyOverlayOpen || isEnded ? 'default' : 'pointer' }}
    >
      {/* Layer 0 — Background */}
      <VNBackground />

      {/* Layer 1 — Sprites */}
      {isStarted && (
        <VNSpritesLayer
          sprites={currentSprites}
          speaker={currentSpeaker}
          shakePosition={shakePosition ?? null}
        />
      )}

      {/* Layer 2 — HUD (chapter, menu button) */}
      <VNHud />

      {/* Layer 3 — Dialog box */}
      {isStarted && <VNDialogBox />}

      {/* Layer 4 — Choices (above dialog) */}
      {isStarted && <VNChoiceMenu />}

      {/* Layer 5 — Overlays */}
      <VNPauseMenu />
      <VNSaveLoad />
      <VNHistoryLog />

      {/* Layer 6 — Ending screen */}
      <VNEndingScreen />
    </div>
  );
}
