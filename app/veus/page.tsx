'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { enigmas, NIVEIS, NIVEL_LABELS } from '@/data/enigmas';
import EnigmaCard from '@/components/EnigmaCard';
import ProgressTracker from '@/components/ProgressTracker';
import { RuneSeparator } from '@/components/RuneSymbol';
import Countdown from '@/components/Countdown';

export default function VeusPage() {
  const router = useRouter();
  const { progress, loaded, isCompleted, isNivelUnlocked, allComplete } = useProgress();

  useEffect(() => {
    if (loaded && !progress.eloName) {
      router.replace('/despertar');
    }
  }, [loaded, progress.eloName, router]);

  if (!loaded || !progress.eloName) return null;

  return (
    <main className="relative min-h-screen z-10 py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-2xl md:text-3xl text-[var(--accent-gold)] tracking-widest uppercase mb-2"
            >
              Os Véus
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-body italic text-[var(--text-secondary)] text-sm"
            >
              Cada véu rasgado é um passo mais fundo no que eu sou.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-3"
          >
            <ProgressTracker showName />
            <Countdown />
          </motion.div>
        </div>

        <RuneSeparator />

        {/* All Complete Banner */}
        {allComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 p-5 border border-[var(--accent-gold)] bg-[#0a0800] text-center"
            style={{ boxShadow: '0 0 40px #d4a01722' }}
          >
            <p className="font-display text-sm text-[var(--accent-gold)] tracking-widest uppercase mb-2">
              ✦ Todos os Véus Rasgados ✦
            </p>
            <Link
              href="/santuario"
              className="font-body italic text-[var(--text-primary)] hover:text-[var(--accent-gold)] transition-colors text-sm"
            >
              O Santuário aguarda. Entre. →
            </Link>
          </motion.div>
        )}

        {/* Levels */}
        <div className="flex flex-col gap-12">
          {NIVEIS.map((nivel, levelIndex) => {
            const levelEnigmas = enigmas.filter((e) => e.nivel === nivel);
            const unlocked = isNivelUnlocked(nivel);
            const completedInLevel = levelEnigmas.filter((e) => isCompleted(e.id)).length;

            return (
              <motion.section
                key={nivel}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: levelIndex * 0.1 }}
              >
                {/* Level header */}
                <div className="flex items-center gap-4 mb-5">
                  <div
                    className="flex items-center gap-3"
                  >
                    <span
                      className={`font-mono text-xs tracking-widest uppercase ${
                        unlocked ? 'text-[var(--accent-crimson)]' : 'text-gray-600'
                      }`}
                    >
                      {unlocked ? '▸' : '⛒'}
                    </span>
                    <h2
                      className={`font-display text-sm md:text-base tracking-wide uppercase ${
                        unlocked ? 'text-[var(--text-primary)]' : 'text-gray-600'
                      }`}
                    >
                      {NIVEL_LABELS[nivel]}
                    </h2>
                  </div>

                  <div className="flex-1 h-px bg-gradient-to-r from-[var(--accent-blood)] to-transparent opacity-40" />

                  <span
                    className={`font-mono text-xs ${
                      completedInLevel === 4
                        ? 'text-[var(--accent-gold)]'
                        : unlocked
                        ? 'text-[var(--text-secondary)]'
                        : 'text-gray-600'
                    }`}
                  >
                    {completedInLevel}/4
                  </span>
                </div>

                {/* Enigma grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {levelEnigmas.map((enigma, i) => (
                    <EnigmaCard
                      key={enigma.id}
                      enigma={enigma}
                      completed={isCompleted(enigma.id)}
                      locked={!unlocked}
                      index={i}
                    />
                  ))}
                </div>

                {/* Unlock hint */}
                {!unlocked && levelIndex > 0 && (
                  <p className="mt-3 font-mono text-xs text-gray-600 italic">
                    Complete ao menos 3 enigmas do véu anterior para desbloquear.
                  </p>
                )}
              </motion.section>
            );
          })}
        </div>

        {/* Provas link — appears after 6+ enigmas completed */}
        {progress.completedEnigmas.length >= 6 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 border border-[var(--accent-blood)] border-opacity-30 p-4 text-center"
          >
            <p className="font-body italic text-[var(--text-secondary)] text-xs mb-2">
              &quot;Häita exige mais do que respostas.&quot;
            </p>
            <Link
              href="/provas"
              className="font-display text-xs text-[var(--accent-crimson)] tracking-widest uppercase hover:text-[var(--accent-gold)] transition-colors"
            >
              As Provas →
            </Link>
          </motion.div>
        )}

        {/* Footer nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex items-center justify-between"
        >
          <Link
            href="/"
            className="font-mono text-xs text-[var(--text-secondary)] opacity-40 hover:opacity-70 transition-opacity tracking-widest"
          >
            ← início
          </Link>
          <Link
            href="/sobre"
            className="font-mono text-xs text-[var(--text-secondary)] opacity-40 hover:opacity-70 transition-opacity tracking-widest"
          >
            sobre →
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
