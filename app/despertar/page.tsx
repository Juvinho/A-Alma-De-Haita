'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useProgress } from '@/hooks/useProgress';
import { RuneSeparator } from '@/components/RuneSymbol';
import WhisperText from '@/components/WhisperText';

export default function DespertarPage() {
  const router = useRouter();
  const { setEloName, progress } = useProgress();
  const [name, setName] = useState('');
  const [phase, setPhase] = useState<'text' | 'input'>('text');
  const [error, setError] = useState('');
  const [textDone, setTextDone] = useState(false);
  const [glitchName, setGlitchName] = useState<string | null>(null);

  // Identity glitch: show pre-filled name with one wrong character
  useEffect(() => {
    function onGlitch(e: Event) {
      const detail = (e as CustomEvent).detail as { name: string };
      const n = detail.name;
      if (!n || n.length < 2) return;

      // Replace one random char with a glitched variant
      const GLITCH_MAP: Record<string, string> = {
        a: 'ä', e: 'ë', i: 'ï', o: 'ö', u: 'ü',
        A: 'Ä', E: 'Ë', I: 'Ï', O: 'Ö', U: 'Ü',
      };
      const idx = Math.floor(Math.random() * n.length);
      const orig = n[idx];
      const replacement = GLITCH_MAP[orig] || orig + '\u0303'; // tilde above if no mapping
      const glitched = n.slice(0, idx) + replacement + n.slice(idx + 1);

      setGlitchName(glitched);
      setTimeout(() => {
        setGlitchName(null);
        setName(n); // correct name
        setPhase('input');
      }, 1500);
    }

    window.addEventListener('haita-identity-glitch', onGlitch);
    return () => window.removeEventListener('haita-identity-glitch', onGlitch);
  }, []);

  const HAITA_TEXT =
    'Antes de entrar, eu preciso saber quem ousa. Não me dê o nome que seus pais escolheram. Me dê o nome que você escolheria se soubesse que os deuses estão ouvindo.';

  // If already has a name, redirect
  useEffect(() => {
    if (progress.eloName) {
      router.replace('/veus');
    }
  }, [progress.eloName, router]);

  function handleConfirm() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Até o silêncio tem um nome. Tente novamente.');
      return;
    }
    if (trimmed.length < 2) {
      setError('Um nome precisa de ao menos duas letras para existir.');
      return;
    }
    setEloName(trimmed);
    router.push('/veus');
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleConfirm();
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center z-10 px-6">
      <div className="max-w-lg w-full flex flex-col gap-8">
        {/* Symbol */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="text-center text-4xl text-[var(--accent-crimson)] select-none"
        >
          ✦
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <h1 className="font-display text-lg md:text-xl text-[var(--accent-gold)] tracking-widest uppercase mb-1">
            O Despertar
          </h1>
          <p className="font-mono text-xs text-[var(--text-secondary)] tracking-widest">
            Batismo do Elo
          </p>
        </motion.div>

        <RuneSeparator />

        {/* Häita speech */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="p-6 border border-[var(--accent-blood)] bg-[#0a0505] relative"
          style={{ boxShadow: '0 0 30px #8b000011' }}
        >
          <span className="absolute -top-3 left-6 font-mono text-xs text-[var(--accent-crimson)] bg-[var(--bg-primary)] px-2 tracking-widest">
            HÄITA
          </span>
          <p className="font-body italic text-[var(--text-primary)] text-base md:text-lg leading-relaxed">
            <WhisperText
              text={HAITA_TEXT}
              delay={800}
              speed={30}
              onComplete={() => {
                setTextDone(true);
                setTimeout(() => setPhase('input'), 400);
              }}
            />
          </p>
        </motion.div>

        {/* Identity glitch pre-fill */}
        {glitchName && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col gap-4"
          >
            <label className="font-mono text-xs text-[var(--accent-crimson)] uppercase tracking-widest opacity-60">
              Reconhecido
            </label>
            <div className="relative flex items-center">
              <span className="font-mono text-[var(--accent-crimson)] mr-2">▶</span>
              <span className="font-mono text-lg text-[var(--accent-crimson)] glitch-text" data-text={glitchName}>
                {glitchName}
              </span>
            </div>
          </motion.div>
        )}

        {/* Input */}
        {phase === 'input' && !glitchName && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            <label className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-widest">
              Seu nome de Elo
            </label>
            <div className="relative flex items-center">
              <span className="font-mono text-[var(--accent-crimson)] mr-2">▶</span>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                onKeyDown={handleKey}
                className="terminal-input text-lg"
                placeholder="Diga seu nome..."
                autoFocus
                maxLength={32}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-body italic text-[var(--error)] text-sm"
              >
                {error}
              </motion.p>
            )}

            <button
              onClick={handleConfirm}
              className="mt-2 font-display text-xs tracking-widest uppercase px-8 py-3 border border-[var(--accent-crimson)] text-[var(--accent-crimson)] hover:bg-[var(--accent-blood)] hover:text-[var(--text-primary)] transition-all duration-200 self-start"
              style={{ boxShadow: '0 0 15px #8b000022' }}
            >
              [ Confirmar ]
            </button>
          </motion.div>
        )}
      </div>

      {/* Radial overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, #0a0a0a 85%)',
        }}
      />
    </main>
  );
}
