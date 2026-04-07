'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { getEnigmaById, NIVEL_LABELS, CATEGORIA_LABELS } from '@/data/enigmas';
import EnigmaInput from '@/components/EnigmaInput';
import { RuneSeparator } from '@/components/RuneSymbol';
import WhisperText from '@/components/WhisperText';

interface Props {
  id: string;
}

export default function EnigmaPageClient({ id }: Props) {
  const router = useRouter();
  const { progress, loaded, isCompleted, completeEnigma, useHint, hintsForEnigma, isNivelUnlocked } =
    useProgress();
  const [descShown, setDescShown] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);

  const enigma = getEnigmaById(id);

  useEffect(() => {
    if (loaded && !progress.eloName) {
      router.replace('/despertar');
    }
  }, [loaded, progress.eloName, router]);

  useEffect(() => {
    if (loaded && enigma && !isNivelUnlocked(enigma.nivel)) {
      router.replace('/veus');
    }
  }, [loaded, enigma, isNivelUnlocked, router]);

  useEffect(() => {
    if (loaded && enigma && isCompleted(enigma.id)) {
      setAlreadyDone(true);
    }
  }, [loaded, enigma, isCompleted]);

  // Fire veil-open event on mount
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('haita-veil-open'));
  }, []);

  if (!loaded || !progress.eloName) return null;

  if (!enigma) {
    return (
      <main className="relative min-h-screen flex items-center justify-center z-10">
        <div className="text-center">
          <p className="font-display text-[var(--error)] mb-4">Este véu não existe.</p>
          <Link href="/veus" className="font-mono text-xs text-[var(--text-secondary)] underline">
            Voltar
          </Link>
        </div>
      </main>
    );
  }

  function handleCorrect() {
    completeEnigma(enigma!.id);
    setTimeout(() => router.push('/veus'), 3800);
  }

  function handleHint() {
    useHint(enigma!.id);
  }

  const isBoss = enigma.nivel === 'veu-5' && enigma.id === 'e20';

  return (
    <main className="relative min-h-screen z-10 py-12 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
          <Link
            href="/veus"
            className="font-mono text-xs text-[var(--text-secondary)] opacity-40 hover:opacity-70 transition-opacity tracking-widest"
          >
            ← véus
          </Link>
        </motion.div>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6 flex-wrap"
        >
          <span className="font-mono text-xs text-[var(--accent-crimson)] uppercase tracking-widest">
            {NIVEL_LABELS[enigma.nivel]}
          </span>
          <span className="text-[var(--accent-blood)] opacity-50">·</span>
          <span className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-widest">
            {CATEGORIA_LABELS[enigma.categoria]}
          </span>
          {alreadyDone && (
            <>
              <span className="text-[var(--accent-blood)] opacity-50">·</span>
              <span className="font-mono text-xs text-[var(--accent-gold)] tracking-widest">
                ✓ Completo
              </span>
            </>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`font-display text-2xl md:text-3xl tracking-wide mb-2 ${
            isBoss ? 'text-[var(--accent-gold)]' : 'text-[var(--text-primary)]'
          }`}
        >
          {enigma.titulo}
        </motion.h1>

        {isBoss && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-xs text-[var(--accent-crimson)] uppercase tracking-widest mb-6"
          >
            ✦ Enigma Final ✦
          </motion.p>
        )}

        <RuneSeparator />

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6 border border-[var(--accent-blood)] bg-[#080404] relative mb-8"
          style={{ boxShadow: isBoss ? '0 0 40px #d4a01711' : '0 0 20px #8b000011' }}
        >
          <span className="absolute -top-3 left-6 font-mono text-xs text-[var(--accent-crimson)] bg-[var(--bg-primary)] px-2 tracking-widest">
            HÄITA
          </span>

          <div className="font-body text-[var(--text-primary)] text-base md:text-lg leading-relaxed whitespace-pre-line">
            <WhisperText
              text={enigma.descricao}
              delay={200}
              speed={20}
              italic
              onComplete={() => setDescShown(true)}
            />
          </div>
        </motion.div>

        {/* Context lore */}
        {enigma.contexto && descShown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-6 px-4 border-l border-[var(--accent-blood)] opacity-50"
          >
            <p className="font-mono text-xs text-[var(--text-secondary)] italic leading-relaxed">
              {enigma.contexto}
            </p>
          </motion.div>
        )}

        {/* Input / Already done */}
        {descShown && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {alreadyDone ? (
              <div className="p-5 border border-[var(--accent-gold)] bg-[#0a0800]">
                <p className="font-display text-xs text-[var(--accent-gold)] uppercase tracking-widest mb-3">
                  ✦ Véu já rasgado
                </p>
                <p className="font-body italic text-[var(--text-primary)] text-base leading-relaxed">
                  &ldquo;{enigma.sussurroDeHaita}&rdquo;
                </p>
                <p className="font-mono text-xs text-[var(--accent-gold)] opacity-60 mt-2 tracking-widest">
                  — Häita, para {progress.eloName}
                </p>
              </div>
            ) : (
              <EnigmaInput
                enigma={enigma}
                hintsUsed={hintsForEnigma(enigma.id)}
                onCorrect={handleCorrect}
                onHintRequest={handleHint}
                eloName={progress.eloName}
              />
            )}
          </motion.div>
        )}

        {/* Enigma ID */}
        <div className="mt-12 flex justify-end">
          <span className="font-mono text-xs text-[var(--text-secondary)] opacity-20">
            {enigma.id.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Pulsing bg glow for boss */}
      {isBoss && (
        <div
          className="fixed inset-0 pointer-events-none z-0 animate-breathe"
          style={{
            background:
              'radial-gradient(ellipse at center, #d4a01708 0%, transparent 60%)',
          }}
        />
      )}
    </main>
  );
}
