'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { useProvaProgress } from '@/hooks/useProvaProgress';
import ProvaHub from '@/components/provas/ProvaHub';
import { RuneSeparator } from '@/components/RuneSymbol';

// Unlock condition: 6+ enigmas completed (Veu 2 partially done)
const ENIGMAS_REQUIRED = 6;

export default function ProvasPage() {
  const router = useRouter();
  const { progress, loaded } = useProgress();
  const { stats, all } = useProvaProgress();

  const completedEnigmas = progress.completedEnigmas ?? [];
  const enigmasCount = completedEnigmas.length;
  const provasUnlocked = enigmasCount >= ENIGMAS_REQUIRED;
  const completedProvas = Object.entries(all)
    .filter(([, p]) => p.completed)
    .map(([id]) => id);

  // Guard: redirect to despertar if no name
  useEffect(() => {
    if (loaded && !progress.eloName) {
      router.replace('/despertar');
    }
  }, [loaded, progress.eloName, router]);

  if (!loaded || !progress.eloName) return null;

  return (
    <main className="relative min-h-screen z-10 py-16 px-4 md:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl md:text-3xl text-[var(--accent-gold)] tracking-widest uppercase mb-2"
          >
            As Provas
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-body italic text-[var(--text-secondary)] text-sm"
          >
            Häita exige mais do que respostas.
          </motion.p>
        </div>

        <RuneSeparator />

        {/* Locked state */}
        {!provasUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <p className="font-display text-[var(--accent-crimson)] tracking-widest uppercase text-sm mb-3">
              Acesso Negado
            </p>
            <p className="font-body italic text-[var(--text-secondary)] text-sm max-w-sm mx-auto leading-relaxed">
              &quot;Você ainda não rasgou véus suficientes para merecer minhas provas. Volte quando tiver 6 enigmas resolvidos.&quot;
            </p>
            <p className="font-mono text-xs text-[var(--text-secondary)] opacity-40 mt-4">
              {enigmasCount}/6 enigmas completados
            </p>
            <Link
              href="/veus"
              className="inline-block mt-6 font-mono text-xs text-[var(--accent-crimson)] border border-[var(--accent-blood)] px-4 py-2 hover:bg-[var(--accent-blood)] hover:text-white transition-colors tracking-widest uppercase"
            >
              Voltar aos véus
            </Link>
          </motion.div>
        )}

        {/* Hub */}
        {provasUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="py-8"
          >
            {/* Summary */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-mono text-xs text-[var(--text-secondary)] opacity-60 tracking-widest">
                  {stats.completedCount}/8 provas completadas
                </p>
                {stats.allComplete && (
                  <p className="font-display text-xs text-[var(--accent-gold)] tracking-widest mt-1 animate-pulse">
                    ✦ Provado por Häita ✦
                  </p>
                )}
              </div>
              <Link
                href="/veus"
                className="font-mono text-xs text-[var(--text-secondary)] opacity-40 hover:opacity-70 transition-opacity tracking-widest"
              >
                ← véus
              </Link>
            </div>

            {/* All-complete reward */}
            {stats.allComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 p-4 border border-[var(--accent-gold)] bg-[#0a0800] text-center"
                style={{ boxShadow: '0 0 30px rgba(212,160,23,0.12)' }}
              >
                <p className="font-body italic text-[var(--text-secondary)] text-xs leading-relaxed">
                  &quot;Você não apenas rasgou os véus. Você sobreviveu ao que estava por trás deles.
                  Não me diga que não sentiu orgulho. Eu senti.&quot;
                </p>
              </motion.div>
            )}

            <ProvaHub completedProvas={completedProvas} />
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex items-center justify-between"
        >
          <Link
            href="/veus"
            className="font-mono text-xs text-[var(--text-secondary)] opacity-40 hover:opacity-70 transition-opacity tracking-widest"
          >
            ← os véus
          </Link>
          <Link
            href="/"
            className="font-mono text-xs text-[var(--text-secondary)] opacity-40 hover:opacity-70 transition-opacity tracking-widest"
          >
            início →
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
