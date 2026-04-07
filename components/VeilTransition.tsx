'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';

export default function VeilTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { engine } = useAudio();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      engine?.effects?.playTransition();
      prevPath.current = pathname;
    }
  }, [pathname, engine]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        className="relative min-h-screen"
        initial="initial"
        animate="enter"
        exit="exit"
      >
        {/* Phase 1: Black overlay slides in from right */}
        <motion.div
          className="fixed inset-0 z-[300] pointer-events-none"
          style={{ background: '#0a0a0a', transformOrigin: 'right center' }}
          variants={{
            initial: { scaleX: 0, transformOrigin: 'right center' },
            enter: {
              scaleX: [0, 1, 1, 0],
              transformOrigin: ['right center', 'right center', 'left center', 'left center'],
              transition: {
                duration: 0.8,
                times: [0, 0.35, 0.45, 1],
                ease: ['easeIn', 'linear', 'easeOut', 'easeOut'],
              },
            },
            exit: {
              scaleX: [0, 1],
              transformOrigin: 'right center',
              transition: { duration: 0.35, ease: 'easeIn' },
            },
          }}
        />

        {/* Phase 2: Crimson crack along center */}
        <motion.div
          className="fixed left-1/2 top-0 bottom-0 z-[299] pointer-events-none"
          style={{
            width: 2,
            background: 'linear-gradient(to bottom, transparent, #8b0000, #cc0000, #8b0000, transparent)',
            boxShadow: '0 0 20px #ff1a1a66, 0 0 40px #8b000033',
            transform: 'translateX(-50%)',
          }}
          variants={{
            initial: { scaleY: 0, opacity: 0 },
            enter: {
              scaleY: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
              transition: {
                duration: 0.8,
                times: [0, 0.3, 0.5, 0.8],
              },
            },
            exit: { scaleY: 0, opacity: 0 },
          }}
        />

        {/* Content */}
        <motion.div
          variants={{
            initial: { opacity: 0 },
            enter: { opacity: 1, transition: { duration: 0.4, delay: 0.5 } },
            exit: { opacity: 0, transition: { duration: 0.3 } },
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
