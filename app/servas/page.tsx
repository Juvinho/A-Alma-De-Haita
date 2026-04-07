'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useVNStore } from '@/stores/vn-store';
import { audioEngine } from '@/lib/vn/audio-engine';

const BG = '/assets/vn/backgrounds/externa-dormitorios-noite-escura.png';

// Floating particle
function Particle({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute w-px h-px rounded-full"
      style={{
        background: 'rgba(201,168,76,0.6)',
        left: `${Math.random() * 100}%`,
        bottom: '-4px',
      }}
      animate={{
        y: [0, -(120 + Math.random() * 200)],
        opacity: [0, 0.6, 0],
        x: [(Math.random() - 0.5) * 40],
      }}
      transition={{
        duration: 4 + Math.random() * 4,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    />
  );
}

function TitleButton({
  label,
  onClick,
  primary,
}: {
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="w-full max-w-[260px] font-cinzel text-sm uppercase tracking-[0.25em] py-3 px-6 transition-all duration-200"
      style={{
        background: primary
          ? 'linear-gradient(135deg, rgba(60,10,5,0.95) 0%, rgba(42,5,5,0.98) 100%)'
          : 'linear-gradient(135deg, rgba(20,5,5,0.8) 0%, rgba(15,3,3,0.9) 100%)',
        border: `1px solid ${primary ? 'var(--vn-border-gold)' : 'var(--vn-border-gold-dim)'}`,
        color: primary ? 'var(--vn-text-gold)' : 'var(--vn-text-cream)',
        clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)',
        boxShadow: primary ? '0 0 20px rgba(201,168,76,0.12), 0 4px 16px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.3)',
      }}
    >
      {label}
    </motion.button>
  );
}

export default function ServasPage() {
  const router = useRouter();
  const [showLoad, setShowLoad] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const saves = useVNStore((s) => s.saves);
  const hasSaves = saves.some(Boolean);

  // Init audio on mount (will be unlocked on first click)
  useEffect(() => {
    const unlock = () => {
      audioEngine.init().then(() => {
        try { audioEngine.startDrone(); } catch { /* ignore */ }
        setAudioReady(true);
      }).catch(() => {});
      window.removeEventListener('click', unlock);
    };
    window.addEventListener('click', unlock);
    return () => window.removeEventListener('click', unlock);
  }, []);

  const handleStart = () => {
    audioEngine.play('transition-whoosh').catch(() => {});
    useVNStore.getState().startGame();
    router.push('/servas/game');
  };

  const handleLoad = () => {
    audioEngine.play('transition-whoosh').catch(() => {});
    useVNStore.getState().toggleSaveLoad('load');
    router.push('/servas/game');
  };

  const handleSite = () => {
    audioEngine.stopDrone();
    router.push('/');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={BG}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.5)' }}
        draggable={false}
      />

      {/* Deep vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(5,0,0,0.7) 100%)',
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <Particle key={i} delay={i * 0.6} />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full gap-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        {/* Top accent */}
        <motion.div
          className="w-32 h-px mb-10"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ background: 'linear-gradient(90deg, transparent, var(--vn-border-gold), transparent)' }}
        />

        {/* Title */}
        <motion.h1
          className="font-cinzel text-center uppercase leading-tight mb-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          style={{
            color: 'var(--vn-text-gold)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '0.3em',
            textShadow: '0 0 40px rgba(201,168,76,0.25)',
          }}
        >
          As Servas
        </motion.h1>
        <motion.h1
          className="font-cinzel text-center uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.75 }}
          style={{
            color: 'var(--vn-text-gold)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            letterSpacing: '0.3em',
            textShadow: '0 0 40px rgba(201,168,76,0.25)',
          }}
        >
          de Häita
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="font-cormorant italic text-center mt-4 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          style={{
            color: 'var(--vn-text-cream)',
            fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
            opacity: 0.75,
          }}
        >
          Uma história sobre o que resta quando tudo cai
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.3 }}
        >
          <TitleButton label="Iniciar" onClick={handleStart} primary />
          {hasSaves && (
            <TitleButton label="Carregar" onClick={handleLoad} />
          )}
          <TitleButton label="Voltar ao Site" onClick={handleSite} />
        </motion.div>

        {/* Bottom accent */}
        <motion.div
          className="w-32 h-px mt-10"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          style={{ background: 'linear-gradient(90deg, transparent, var(--vn-border-gold), transparent)' }}
        />

        {/* Credits */}
        <motion.p
          className="absolute bottom-5 font-cinzel text-xs uppercase tracking-[0.3em]"
          style={{ color: 'var(--vn-text-muted)', opacity: 0.5 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 2 }}
        >
          Fundação Varguelia — JuvinhoDev
        </motion.p>
      </motion.div>
    </div>
  );
}
