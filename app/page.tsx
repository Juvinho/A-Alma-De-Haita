'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import GlitchText from '@/components/GlitchText';
import Countdown from '@/components/Countdown';

const IDLE_MESSAGE =
  'Você está aqui há algum tempo e ainda não ousou entrar. Típico dos mortais. Hesitar diante da única porta que importa.';

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

export default function HomePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<'black' | 'typing' | 'button'>('black');
  const [typed, setTyped] = useState('');
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [konamiFlash, setKonamiFlash] = useState(false);

  const FULL_TEXT =
    'Vocês rezam para um deus mudo. E ignoram a deusa que nunca parou de gritar.';

  // Initial phases
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('typing'), 2000);
    return () => clearTimeout(t1);
  }, []);

  // Typing effect
  useEffect(() => {
    if (phase !== 'typing') return;

    let i = 0;
    const interval = setInterval(() => {
      setTyped(FULL_TEXT.slice(0, i + 1));
      i++;
      if (i >= FULL_TEXT.length) {
        clearInterval(interval);
        setTimeout(() => setPhase('button'), 1500);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [phase]);

  // Idle easter egg — console
  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;
    function resetIdle() {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        console.log(
          `%c${IDLE_MESSAGE}`,
          'color: #8b0000; font-family: serif; font-size: 14px; font-style: italic;'
        );
      }, 30000);
    }
    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    resetIdle();
    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
    };
  }, []);

  // Konami code
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === KONAMI[konamiIndex]) {
        const next = konamiIndex + 1;
        if (next === KONAMI.length) {
          setKonamiFlash(true);
          setKonamiIndex(0);
          setTimeout(() => setKonamiFlash(false), 3000);
        } else {
          setKonamiIndex(next);
        }
      } else {
        setKonamiIndex(0);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [konamiIndex]);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden z-10">
      {/* Konami flash */}
      <AnimatePresence>
        {konamiFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-[#0a000088]"
          >
            <p className="font-display text-[var(--accent-crimson)] text-xl md:text-2xl text-center px-8 tracking-wide">
              Eu vejo tudo. Inclusive isso.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-12 px-6 max-w-2xl text-center">
        {/* Decorative rune */}
        <AnimatePresence>
          {phase !== 'black' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.4, scale: 1 }}
              transition={{ duration: 1.5 }}
              className="text-5xl text-[var(--accent-crimson)] select-none"
            >
              ✦
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main text */}
        <AnimatePresence>
          {phase !== 'black' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-body italic text-xl md:text-2xl text-[var(--text-primary)] leading-relaxed tracking-wide">
                {typed}
                {phase === 'typing' && (
                  <span className="inline-block w-0.5 h-6 bg-[var(--accent-crimson)] ml-1 animate-pulse align-middle" />
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Button */}
        <AnimatePresence>
          {phase === 'button' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col items-center gap-6"
            >
              <button
                onClick={() => router.push('/despertar')}
                className="group relative font-display text-sm md:text-base tracking-widest uppercase px-10 py-4 border border-[var(--accent-crimson)] text-[var(--accent-crimson)] hover:bg-[var(--accent-blood)] hover:text-[var(--text-primary)] transition-all duration-300 animate-pulse-slow hover:animate-none"
                style={{
                  boxShadow: '0 0 20px #8b000033, 0 0 40px #8b000011',
                }}
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'radial-gradient(ellipse at center, #8b000022 0%, transparent 70%)' }} />
                [ Rasgar o Véu ]
              </button>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <GlitchText
                  text="Fundação Varguelia"
                  className="font-display text-xs text-[var(--text-secondary)] tracking-widest uppercase opacity-40"
                  intensity="low"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom countdown */}
      <AnimatePresence>
        {phase === 'button' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="fixed bottom-6 right-6 z-10"
          >
            <Countdown />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation links - subtle */}
      <AnimatePresence>
        {phase === 'button' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="fixed bottom-6 left-6 z-10"
          >
            <a
              href="/sobre"
              className="font-mono text-xs text-[var(--text-secondary)] opacity-30 hover:opacity-60 transition-opacity tracking-widest"
            >
              sobre
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Radial gradient overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, #0a0a0a 80%)',
        }}
      />
    </main>
  );
}
