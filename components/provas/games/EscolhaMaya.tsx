'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProvaLayout from '@/components/provas/ProvaLayout';
import { useProvaProgress } from '@/hooks/useProvaProgress';
import { useAudio } from '@/contexts/AudioContext';
import { HAITA_COMMENTS } from '@/data/provas-meta';
import {
  STORY_NODES,
  STORY_START,
  ENDING_MESSAGES,
  ENDING_LABELS,
  ENDING_ICONS,
  EndingType,
} from '@/data/maya-story';

// ─── Typewriter hook ──────────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 30) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval>>();
  const idxRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    idxRef.current = 0;
    clearInterval(ref.current);
    ref.current = setInterval(() => {
      idxRef.current++;
      setDisplayed(text.slice(0, idxRef.current));
      if (idxRef.current >= text.length) {
        clearInterval(ref.current);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(ref.current);
  }, [text, speed]);

  function skip() {
    clearInterval(ref.current);
    setDisplayed(text);
    setDone(true);
  }

  return { displayed, done, skip };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EscolhaMaya({ onComplete }: { onComplete?: () => void }) {
  const { engine } = useAudio();
  const { completeProva, recordAttempt, getProva } = useProvaProgress();

  const [nodeId, setNodeId] = useState<string | null>(null);
  const [phase, setPhase] = useState<'intro' | 'reading' | 'choices' | 'ending' | 'summary'>('intro');
  const [currentEnding, setCurrentEnding] = useState<EndingType | null>(null);
  const [foundEndings, setFoundEndings] = useState<Set<EndingType>>(new Set());
  const [timer, setTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [comment, setComment] = useState(HAITA_COMMENTS.p7.start);

  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Load saved endings
  useState(() => {
    const prog = getProva('p7');
    if (prog.details?.endings) {
      setFoundEndings(new Set(prog.details.endings as EndingType[]));
    }
  });

  const node = nodeId ? STORY_NODES[nodeId] : null;
  const text = node?.text ?? '';
  const { displayed, done, skip } = useTypewriter(phase === 'reading' || phase === 'choices' ? text : '', 28);

  // ── Navigate to node ─────────────────────────────────────────────────────────
  function goTo(id: string) {
    const n = STORY_NODES[id];
    if (!n) return;
    engine?.effects?.playHover();
    setNodeId(id);

    if (n.ending) {
      setPhase('ending');
      setCurrentEnding(n.ending);
      clearInterval(timerRef.current);

      setFoundEndings((prev) => {
        const next = new Set(prev).add(n.ending!);
        const allThree = next.size >= 3;
        completeProva('p7', {
          details: { endings: Array.from(next) },
          score: next.size,
        });
        if (allThree) onComplete?.();
        return next;
      });
    } else if (n.choices && n.choices.length > 0) {
      setPhase('choices');
    } else if (n.next) {
      setPhase('reading');
    }
  }

  function makeChoice(next: string) {
    engine?.effects?.playClick();
    goTo(next);
  }

  function advanceLinear() {
    if (!node || !done) { skip(); return; }
    if (node.next) {
      goTo(node.next);
    }
  }

  // ── Start ────────────────────────────────────────────────────────────────────
  function startStory() {
    recordAttempt('p7');
    setAttempts((a) => a + 1);
    setTimer(0);
    setComment(HAITA_COMMENTS.p7.start);
    goTo(STORY_START);
    setPhase('reading');

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
  }

  useEffect(() => () => clearInterval(timerRef.current), []);

  useEffect(() => {
    if (currentEnding !== 'transcend' || typeof window === 'undefined') return;
    localStorage.setItem('haita-fragment-v', 'GRAND\'');
  }, [currentEnding]);

  // ─── Render ───────────────────────────────────────────────────────────────────

  if (phase === 'intro' || phase === 'summary') {
    return (
      <ProvaLayout provaId="p7" nome="A Escolha de Maya" haitaComment={comment} timer={timer} attempts={attempts}>
        <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
          <div className="text-center max-w-sm">
            <p className="font-display text-xs text-[var(--accent-gold)] tracking-widest uppercase mb-4">
              Finais descobertos
            </p>
            <div className="flex gap-6 justify-center mb-6">
              {(['survive', 'fall', 'transcend'] as EndingType[]).map((e) => (
                <div key={e} className="flex flex-col items-center gap-1">
                  <span className="text-xl" style={{ opacity: foundEndings.has(e) ? 1 : 0.2 }}>
                    {ENDING_ICONS[e]}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest" style={{ color: foundEndings.has(e) ? 'var(--accent-gold)' : 'var(--text-secondary)', opacity: foundEndings.has(e) ? 0.8 : 0.3 }}>
                    {ENDING_LABELS[e]}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="font-body italic text-[var(--text-secondary)] text-sm text-center max-w-xs">
            &quot;{HAITA_COMMENTS.p7.start}&quot;
          </p>
          <button
            onClick={startStory}
            className="border border-[var(--accent-blood)] px-5 py-2 font-mono text-xs text-[var(--accent-crimson)] hover:bg-[var(--accent-blood)] hover:text-white transition-colors tracking-widest uppercase"
          >
            {foundEndings.size === 0 ? 'Começar' : foundEndings.size < 3 ? `Jogar novamente (${foundEndings.size}/3)` : 'Rever a história'}
          </button>
        </div>
      </ProvaLayout>
    );
  }

  if (phase === 'ending' && currentEnding) {
    return (
      <ProvaLayout provaId="p7" nome="A Escolha de Maya" haitaComment={comment} timer={timer} attempts={attempts}>
        <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-sm"
          >
            <div className="text-4xl mb-4">{ENDING_ICONS[currentEnding]}</div>
            <p className="font-display text-sm text-[var(--accent-gold)] tracking-widest uppercase mb-4">
              {ENDING_LABELS[currentEnding]}
            </p>
            <p className="font-body italic text-[var(--text-secondary)] text-sm leading-relaxed">
              &quot;{ENDING_MESSAGES[currentEnding]}&quot;
            </p>

            {currentEnding === 'transcend' && (
              <p className="font-mono text-[10px] leading-relaxed mt-6 opacity-[0.08] text-[var(--accent-gold)]">
                A primeira palavra e completa. Agora a segunda. Ela comeca com o que os antigos
                catatunheses colocavam antes do nome da Mae para torna-la maior do que ja era.
              </p>
            )}
          </motion.div>
          <div className="flex gap-3">
            <button
              onClick={() => setPhase('summary')}
              className="border border-[var(--accent-blood)] px-4 py-2 font-mono text-xs text-[var(--accent-crimson)] hover:bg-[var(--accent-blood)] hover:text-white transition-colors tracking-widest uppercase"
            >
              Ver finais
            </button>
            <button
              onClick={startStory}
              className="border border-[var(--accent-gold)] px-4 py-2 font-mono text-xs text-[var(--accent-gold)] hover:bg-[var(--accent-blood)] hover:text-white transition-colors tracking-widest uppercase"
            >
              Jogar novamente
            </button>
          </div>
        </div>
      </ProvaLayout>
    );
  }

  // Reading / choices
  return (
    <ProvaLayout provaId="p7" nome="A Escolha de Maya" haitaComment={comment} timer={timer} attempts={attempts}>
      <div
        className="flex flex-col h-full cursor-pointer"
        onClick={phase === 'reading' ? advanceLinear : undefined}
      >
        {/* Separator rune */}
        <div className="flex items-center gap-3 px-6 py-3">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--accent-blood)] to-transparent opacity-30" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[var(--accent-crimson)] opacity-40" />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[var(--accent-blood)] to-transparent opacity-30" />
        </div>

        {/* Text area */}
        <div className="flex-1 flex flex-col justify-center px-6 py-4 overflow-y-auto">
          <AnimatePresence mode="wait">
            {node && (
              <motion.div
                key={nodeId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto w-full"
              >
                {node.speaker && (
                  <p className="font-display text-xs tracking-widest uppercase mb-2" style={{ color: node.speaker === 'Häita' ? 'var(--accent-gold)' : 'var(--accent-crimson)' }}>
                    {node.speaker}
                  </p>
                )}
                <p className="font-body text-[var(--text-primary)] leading-relaxed text-sm md:text-base">
                  {displayed}
                  {!done && <span className="inline-block w-0.5 h-4 bg-[var(--text-primary)] opacity-70 ml-0.5 animate-pulse" />}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Choices */}
        {phase === 'choices' && done && node?.choices && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="px-6 pb-4 space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--accent-blood)] to-transparent opacity-20 mb-3" />
            {node.choices.map((c, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                onClick={() => makeChoice(c.next)}
                className="w-full text-left px-4 py-3 border border-[var(--accent-blood)] hover:bg-[var(--accent-blood)] hover:border-[var(--accent-crimson)] transition-colors group"
              >
                <span className="font-body text-[var(--text-primary)] group-hover:text-white text-sm transition-colors">
                  <span className="text-[var(--accent-crimson)] mr-2 opacity-60">›</span>
                  {c.text}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Continue hint (linear nodes) */}
        {phase === 'reading' && done && node?.next && (
          <div className="px-6 pb-3 flex justify-end">
            <span className="font-mono text-xs text-[var(--text-secondary)] opacity-30 animate-pulse">
              toque para continuar ›
            </span>
          </div>
        )}
      </div>
    </ProvaLayout>
  );
}
