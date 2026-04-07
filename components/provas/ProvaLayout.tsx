'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/contexts/AudioContext';

interface ProvaLayoutProps {
  provaId: string;
  nome: string;
  children: React.ReactNode;
  haitaComment?: string;
  timer?: number;          // seconds elapsed (caller manages)
  attempts?: number;
  onPause?: () => void;
  onResume?: () => void;
  isPaused?: boolean;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function ProvaLayout({
  provaId,
  nome,
  children,
  haitaComment = '',
  timer = 0,
  attempts = 0,
  onPause,
  onResume,
  isPaused = false,
}: ProvaLayoutProps) {
  const { engine } = useAudio();
  const [visibleComment, setVisibleComment] = useState(haitaComment);
  const [commentKey, setCommentKey] = useState(0);
  const prevComment = useRef(haitaComment);

  // Animate comment change
  useEffect(() => {
    if (haitaComment !== prevComment.current) {
      prevComment.current = haitaComment;
      setVisibleComment(haitaComment);
      setCommentKey((k) => k + 1);
    }
  }, [haitaComment]);

  function togglePause() {
    if (isPaused) {
      onResume?.();
    } else {
      onPause?.();
      engine?.effects?.playClick();
    }
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-[var(--bg-primary)] select-none">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--accent-blood)] shrink-0">
        <Link
          href="/provas"
          className="font-mono text-xs text-[var(--text-secondary)] opacity-50 hover:opacity-90 transition-opacity tracking-widest"
          onClick={() => engine?.effects?.playClick()}
        >
          ← voltar
        </Link>

        <h1 className="font-display text-sm md:text-base text-[var(--accent-gold)] tracking-widest uppercase">
          PROVA: {nome}
        </h1>

        <button
          onClick={togglePause}
          className="font-mono text-xs text-[var(--text-secondary)] opacity-50 hover:opacity-90 transition-opacity tracking-widest"
          aria-label={isPaused ? 'Retomar' : 'Pausar'}
        >
          {isPaused ? '▶ retomar' : '⏸ pausar'}
        </button>
      </header>

      {/* ── Game area ── */}
      <div className="flex-1 relative overflow-hidden">
        {children}

        {/* Pause overlay */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/80"
            >
              <div className="text-center px-6">
                <p className="font-display text-[var(--accent-gold)] tracking-widest uppercase text-lg mb-2">
                  PAUSADO
                </p>
                <p className="font-body italic text-[var(--text-secondary)] text-sm mb-6">
                  &quot;Eu te espero. O labirinto também.&quot;
                </p>
                <button
                  onClick={togglePause}
                  className="font-mono text-xs text-[var(--accent-crimson)] border border-[var(--accent-blood)] px-5 py-2 hover:bg-[var(--accent-blood)] hover:text-[var(--text-primary)] transition-colors tracking-widest uppercase"
                >
                  Retomar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <footer className="shrink-0 border-t border-[var(--accent-blood)] px-4 py-3 space-y-2">
        {/* Häita comment */}
        <div className="min-h-[1.25rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={commentKey}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.4 }}
              className="font-body italic text-[var(--text-secondary)] text-xs text-center"
            >
              {visibleComment && `"${visibleComment}"`}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-[var(--text-secondary)] opacity-40 tracking-widest">
            PROVA {provaId.replace('p', '')}
          </span>
          <div className="flex gap-5">
            <span className="font-mono text-xs text-[var(--text-secondary)] opacity-60">
              {formatTime(timer)}
            </span>
            <span className="font-mono text-xs text-[var(--text-secondary)] opacity-60">
              tentativas: {attempts}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
