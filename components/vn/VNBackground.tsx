'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { backgrounds } from '@/data/vn/backgrounds';
import { useVNStore } from '@/stores/vn-store';
import { story } from '@/data/story';

export function VNBackground() {
  const currentBackground = useVNStore((s) => s.currentBackground);
  const currentNodeId = useVNStore((s) => s.currentNodeId);

  const [displayedBg, setDisplayedBg] = useState(currentBackground);
  const [transition, setTransition] = useState<string>('none');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [shake, setShake] = useState(false);
  const [flashColor, setFlashColor] = useState<string | null>(null);
  const [blurActive, setBlurActive] = useState(false);
  const prevBgRef = useRef(currentBackground);

  useEffect(() => {
    if (currentBackground === prevBgRef.current) return;

    const node = story[currentNodeId];
    const t = node?.transition ?? 'dissolve';

    setTransition(t);

    if (t === 'shake') {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setDisplayedBg(currentBackground);
    } else if (t === 'flash-white') {
      setFlashColor('white');
      setDisplayedBg(currentBackground);
      setTimeout(() => setFlashColor(null), 400);
    } else if (t === 'flash-red') {
      setFlashColor('rgba(139,0,0,0.85)');
      setDisplayedBg(currentBackground);
      setTimeout(() => setFlashColor(null), 400);
    } else if (t === 'blur') {
      setBlurActive(true);
      setTimeout(() => {
        setDisplayedBg(currentBackground);
        setTimeout(() => setBlurActive(false), 250);
      }, 250);
    } else if (t === 'none') {
      setDisplayedBg(currentBackground);
    } else {
      // fade or dissolve: framer-motion AnimatePresence handles it
      setDisplayedBg(currentBackground);
    }

    prevBgRef.current = currentBackground;
  }, [currentBackground, currentNodeId]);

  const bgUrl = backgrounds[displayedBg] ?? backgrounds['quarto-ella-noite'];

  const shakeVariants = {
    shake: {
      x: [0, -4, 4, -3, 3, -2, 2, 0],
      y: [0, -2, 2, -2, 2, -1, 1, 0],
      transition: { duration: 0.6, ease: 'easeInOut' },
    },
    rest: { x: 0, y: 0 },
  };

  const transitionDuration =
    transition === 'fade' ? 0.5 :
    transition === 'dissolve' ? 0.4 :
    0.2;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={displayedBg}
          className="absolute inset-0"
          initial={transition === 'none' ? false : { opacity: 0 }}
          animate={shake ? shakeVariants.shake : { opacity: 1, x: 0, y: 0 }}
          exit={transition === 'none' ? undefined : { opacity: 0 }}
          transition={{ duration: transitionDuration, ease: 'easeInOut' }}
          style={{
            filter: blurActive ? 'blur(8px)' : 'none',
            transition: blurActive ? 'filter 0.25s ease' : 'filter 0.25s ease',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgUrl}
            alt=""
            className="w-full h-full object-cover select-none"
            draggable={false}
          />
          {/* Overlay escuro sutil para melhorar legibilidade */}
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* Flash overlay */}
      {flashColor && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ backgroundColor: flashColor }}
        />
      )}
    </div>
  );
}
