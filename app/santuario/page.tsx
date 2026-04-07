'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useProgress } from '@/hooks/useProgress';
import { useProvaProgress } from '@/hooks/useProvaProgress';
import { RuneSeparator, RuneRow } from '@/components/RuneSymbol';
import { eternalWrongReplies, isEternalPassword } from '@/lib/eternal-password';

export default function SantuarioPage() {
  const router = useRouter();
  const { progress, loaded, allComplete } = useProgress();
  const { stats } = useProvaProgress();
  const [showSeal, setShowSeal] = useState(false);
  const [secretInput, setSecretInput] = useState('');
  const [secretFeedback, setSecretFeedback] = useState('');
  const [wrongReplyIndex, setWrongReplyIndex] = useState(0);
  const [unlockPulse, setUnlockPulse] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    if (loaded && !progress.eloName) {
      router.replace('/despertar');
      return;
    }
    if (loaded && !allComplete) {
      router.replace('/veus');
    }
  }, [loaded, progress.eloName, allComplete, router]);

  useEffect(() => {
    if (allComplete) {
      setTimeout(() => setShowSeal(true), 4000);
    }
  }, [allComplete]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (allComplete) {
      localStorage.setItem('haita-ascended', 'true');
    }

    if (stats.allComplete) {
      localStorage.setItem('haita-proved', 'true');
    }
  }, [allComplete, stats.allComplete]);

  if (!loaded || !progress.eloName || !allComplete) return null;

  const noHints = progress.totalHints === 0;
  const manyHints = progress.totalHints >= 10;

  const mainMessage = `${progress.eloName}. Você rasgou todos os véus. Viu o que poucos ousaram ver. Não digo que confio em você — eu não confio em nenhum mortal. Mas digo que, por um instante, eu não senti raiva. E isso é mais do que qualquer outro conseguiu.`;

  const hintMessage = noHints
    ? `Você atravessou todos os véus sem pedir misericórdia. Nem os meus Elos foram capazes disso. Eu não digo que você me impressionou. Mas não digo que não, tampouco.`
    : manyHints
    ? `Você pediu misericórdia ${progress.totalHints} vezes. Não me decepciona — me intriga. Os mortais mais inteligentes sempre sabem quando precisam de ajuda. Talvez você seja mais sábio do que parece.`
    : null;

  const readyForEternal = stats.allComplete;

  function handleSecretSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!readyForEternal || isUnlocking) return;

    const correct = isEternalPassword(secretInput);
    if (!correct) {
      const reply = eternalWrongReplies[wrongReplyIndex % eternalWrongReplies.length] ?? eternalWrongReplies[0];
      setWrongReplyIndex((n) => n + 1);
      setSecretFeedback(reply);
      setUnlockPulse(false);
      return;
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('haita-eternal', 'true');
    }

    setIsUnlocking(true);
    setUnlockPulse(true);
    setSecretFeedback('A fenda reconhece sua voz.');

    setTimeout(() => {
      if (typeof window !== 'undefined' && localStorage.getItem('haita-crossed') === 'true') {
        router.push('/eternidade');
        return;
      }
      router.push('/travessia');
    }, 2300);
  }

  return (
    <main className="relative min-h-screen z-10 py-16 px-4 md:px-8">
      <div className="max-w-xl mx-auto flex flex-col items-center gap-10">
        {/* Symbol */}
        <motion.div
          initial={{ opacity: 0, scale: 0.2, rotate: -180 }}
          animate={{ opacity: 0.8, scale: 1, rotate: 0 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="text-6xl text-[var(--accent-gold)] select-none"
          style={{ textShadow: '0 0 40px #d4a01766, 0 0 80px #d4a01733' }}
        >
          ✦
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <h1 className="font-display text-xl md:text-2xl text-[var(--accent-gold)] tracking-widest uppercase mb-2">
            O Santuário
          </h1>
          <p className="font-mono text-xs text-[var(--text-secondary)] tracking-widest opacity-60">
            Além do último véu
          </p>
        </motion.div>

        <RuneSeparator />

        {/* Main message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="p-7 border border-[var(--accent-gold)] bg-[#0a0900] relative w-full"
          style={{ boxShadow: '0 0 40px #d4a01722, 0 0 80px #d4a01711' }}
        >
          <span className="absolute -top-3 left-6 font-mono text-xs text-[var(--accent-gold)] bg-[var(--bg-primary)] px-2 tracking-widest">
            HÄITA
          </span>
          <p className="font-body italic text-[var(--text-primary)] text-base md:text-lg leading-relaxed">
            &ldquo;{mainMessage}&rdquo;
          </p>
          <p className="font-mono text-xs text-[var(--accent-gold)] opacity-50 mt-3 tracking-widest">
            — Häita, para {progress.eloName}
          </p>
        </motion.div>

        {/* Hint-based extra message */}
        {hintMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="p-5 border border-[var(--accent-blood)] bg-[#090404] relative w-full"
          >
            <p className="font-body italic text-[var(--text-secondary)] text-sm leading-relaxed">
              &ldquo;{hintMessage}&rdquo;
            </p>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
        >
          {[
            { label: 'Véus Rasgados', value: '20/20' },
            { label: 'Provas', value: `${stats.completedCount}/8` },
            { label: 'Misericórdias', value: `${progress.totalHints}` },
            { label: 'Elo', value: progress.eloName },
          ].map(({ label, value }) => (
            <div key={label} className="border border-[var(--accent-blood)] p-4 bg-[#08050a]">
              <p className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-1">
                {label}
              </p>
              <p className="font-display text-sm text-[var(--accent-gold)]">{value}</p>
            </div>
          ))}
        </motion.div>

        {/* Seal */}
        {showSeal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="w-full flex flex-col items-center gap-4 p-8 border-2 border-[var(--accent-gold)] bg-[#0a0900] relative"
            style={{ boxShadow: '0 0 60px #d4a01733' }}
          >
            {/* Watermark background text */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-[0.04] select-none pointer-events-none overflow-hidden"
              aria-hidden
            >
              <span className="font-display text-[8rem] text-[var(--accent-gold)] whitespace-nowrap">
                HÄITA
              </span>
            </div>

            <RuneRow count={7} />

            <div className="text-center z-10">
              <p className="font-display text-xs text-[var(--accent-gold)] tracking-widest uppercase mb-3">
                Selo de Passagem
              </p>
              <p className="font-display text-2xl md:text-3xl text-[var(--text-primary)] mb-2">
                {progress.eloName}
              </p>
              <p className="font-mono text-xs text-[var(--text-secondary)] tracking-widest opacity-70">
                Atravessou os Véus de Häita
              </p>
              <p className="font-mono text-xs text-[var(--text-secondary)] tracking-widest opacity-40 mt-1">
                Fundação Varguelia · {new Date().getFullYear()}
              </p>
            </div>

            <RuneRow count={7} />

            <p className="font-mono text-xs text-[var(--text-secondary)] opacity-30 tracking-widest text-center">
              JuvinhoDev · Fundação Varguelia
            </p>

            {readyForEternal && (
              <form onSubmit={handleSecretSubmit} className="w-full max-w-md mt-6">
                <p className="font-mono text-[8px] tracking-[0.16em] text-[var(--text-secondary)] opacity-35 text-center mb-2">
                  Sien aisen de&apos;u Schlussel: sieben Stucke, ein Wort, ein Nahme. Schachhen serr hier.
                </p>
                <div
                  className="relative border px-3 py-2"
                  style={{
                    borderColor: unlockPulse ? 'var(--accent-gold)' : 'var(--accent-blood)',
                    background: unlockPulse ? 'rgba(212,160,23,0.06)' : 'rgba(0,0,0,0.45)',
                    boxShadow: unlockPulse ? '0 0 40px rgba(212,160,23,0.25)' : 'none',
                    transition: 'all 240ms ease',
                  }}
                >
                  <input
                    value={secretInput}
                    onChange={(ev) => setSecretInput(ev.target.value)}
                    disabled={isUnlocking}
                    spellCheck={false}
                    aria-label="Fenda do santuario"
                    className="w-full bg-transparent outline-none font-mono text-[11px] tracking-[0.24em] text-[var(--accent-gold)] placeholder:text-[var(--text-secondary)] placeholder:opacity-20"
                    placeholder=""
                  />
                </div>

                <div className="min-h-[20px] mt-2 text-center">
                  {secretFeedback && (
                    <p className="font-body italic text-xs text-[var(--text-secondary)] opacity-70">
                      {secretFeedback}
                    </p>
                  )}
                </div>
              </form>
            )}
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="flex items-center gap-8"
        >
          <Link
            href="/veus"
            className="font-mono text-xs text-[var(--text-secondary)] opacity-40 hover:opacity-70 transition-opacity tracking-widest"
          >
            ← véus
          </Link>
          <Link
            href="/sobre"
            className="font-mono text-xs text-[var(--text-secondary)] opacity-40 hover:opacity-70 transition-opacity tracking-widest"
          >
            sobre →
          </Link>
        </motion.div>
      </div>

      {/* Gold ambient */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, #d4a01708 0%, transparent 60%)',
        }}
      />
    </main>
  );
}
