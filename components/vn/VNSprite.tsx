'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { getSpritePath } from '@/data/vn/sprites';
import type { SpriteSlot } from '@/types/vn';

interface VNSpriteProps {
  sprite: SpriteSlot;
  position: 'left' | 'center' | 'right';
  isSpeaking: boolean;
  shake?: boolean;
}

const positionStyles: Record<string, string> = {
  left: 'left-[5%]',
  center: 'left-1/2 -translate-x-1/2',
  right: 'right-[5%]',
};

const enterVariants = {
  left: { x: -80, opacity: 0 },
  center: { scale: 0.96, opacity: 0 },
  right: { x: 80, opacity: 0 },
};

const shakeKeyframes = {
  x: [0, -4, 4, -3, 3, -2, 2, -1, 1, 0],
  y: [0, -2, 2, -1, 1, 0],
  transition: { duration: 0.5, ease: 'easeInOut' },
};

export function VNSprite({ sprite, position, isSpeaking, shake = false }: VNSpriteProps) {
  const src = getSpritePath(sprite.char, sprite.pose);
  const brightness = isSpeaking ? 1 : 0.55;

  return (
    <motion.div
      key={`${sprite.char}-${position}`}
      className={`absolute bottom-[22%] ${positionStyles[position]} pointer-events-none select-none`}
      style={{ zIndex: isSpeaking ? 10 : 5 }}
      initial={enterVariants[position]}
      animate={
        shake
          ? shakeKeyframes
          : {
              x: position === 'left' ? 0 : position === 'right' ? 0 : undefined,
              scale: 1,
              opacity: 1,
            }
      }
      exit={
        position === 'left'
          ? { x: -80, opacity: 0, transition: { duration: 0.25 } }
          : position === 'right'
          ? { x: 80, opacity: 0, transition: { duration: 0.25 } }
          : { opacity: 0, scale: 0.96, transition: { duration: 0.25 } }
      }
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <motion.img
        src={src}
        alt={sprite.char}
        className="h-[72vh] max-h-[600px] w-auto object-contain"
        style={{ filter: `brightness(${brightness})` }}
        animate={{ filter: `brightness(${brightness})` }}
        transition={{ duration: 0.3 }}
        draggable={false}
      />
    </motion.div>
  );
}

interface VNSpritesLayerProps {
  sprites: {
    left?: SpriteSlot | null;
    center?: SpriteSlot | null;
    right?: SpriteSlot | null;
  };
  speaker: string | null;
  shakePosition?: 'left' | 'center' | 'right' | null;
}

export function VNSpritesLayer({ sprites, speaker, shakePosition }: VNSpritesLayerProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {sprites.left && (
          <VNSprite
            key={`left-${sprites.left.char}-${sprites.left.pose}`}
            sprite={sprites.left}
            position="left"
            isSpeaking={speaker === sprites.left.char}
            shake={shakePosition === 'left'}
          />
        )}
        {sprites.center && (
          <VNSprite
            key={`center-${sprites.center.char}-${sprites.center.pose}`}
            sprite={sprites.center}
            position="center"
            isSpeaking={speaker === sprites.center.char}
            shake={shakePosition === 'center'}
          />
        )}
        {sprites.right && (
          <VNSprite
            key={`right-${sprites.right.char}-${sprites.right.pose}`}
            sprite={sprites.right}
            position="right"
            isSpeaking={speaker === sprites.right.char}
            shake={shakePosition === 'right'}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
