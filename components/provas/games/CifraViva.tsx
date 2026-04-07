'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProvaLayout from '@/components/provas/ProvaLayout';
import { useProvaProgress } from '@/hooks/useProvaProgress';
import { useAudio } from '@/contexts/AudioContext';
import { HAITA_COMMENTS, WORD_PAIRS, WordPair } from '@/data/provas-meta';

// ─── Falling word ─────────────────────────────────────────────────────────────

interface FallingWord {
  id: number;
  pair: WordPair;
  x: number;           // % of container width
  y: number;           // % of container height
  speed: number;       // % per second
  hit: boolean;        // destroyed — correct
  missed: boolean;     // reached bottom
  explode: boolean;    // playing explosion
}

// ─── Lives display ────────────────────────────────────────────────────────────

function LivesBar({ lives, max }: { lives: number; max: number }) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: max }, (_, i) => (
        <motion.div
          key={i}
          animate={{ scale: i < lives ? 1 : 0.7, opacity: i < lives ? 1 : 0.3 }}
          className="w-4 h-1"
          style={{ background: i < lives ? 'var(--accent-crimson)' : 'var(--accent-blood)' }}
        />
      ))}
    </div>
  );
}

// ─── Pulse power indicator ────────────────────────────────────────────────────

function PulsePower({ count }: { count: number }) {
  return (
    <div className="flex gap-1 items-center">
      <span className="font-mono text-[10px] text-[var(--text-secondary)] opacity-50 mr-1">PULSO</span>
      {Array.from({ length: Math.min(count, 5) }, (_, i) => (
        <div key={i} className="w-2 h-2 rounded-full bg-[var(--accent-gold)] opacity-70" />
      ))}
    </div>
  );
}

const MAX_LIVES = 5;
const WORDS_PER_PULSE = 10;

// ─── Component ────────────────────────────────────────────────────────────────

export default function CifraViva({ onComplete }: { onComplete?: () => void }) {
  const { engine } = useAudio();
  const { completeProva, recordAttempt } = useProvaProgress();

  const [phase, setPhase] = useState<'idle' | 'playing' | 'gameover' | 'win'>('idle');
  const [words, setWords] = useState<FallingWord[]>([]);
  const [input, setInput] = useState('');
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [pulses, setPulses] = useState(0);
  const [pulseFrozen, setPulseFrozen] = useState(false);
  const [wave, setWave] = useState(1);
  const [comment, setComment] = useState(HAITA_COMMENTS.p6.start);
  const [timer, setTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [haitaFlash, setHaitaFlash] = useState(false);

  const wordIdRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const spawnRef = useRef<ReturnType<typeof setInterval>>();
  const waveRef = useRef<ReturnType<typeof setInterval>>();
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const livesRef = useRef(MAX_LIVES);
  const scoreRef = useRef(0);
  const streakRef = useRef(0);
  const pulsesRef = useRef(0);
  const waveRef2 = useRef(1);
  const pulseFrozenRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Pool of words for current wave ──────────────────────────────────────────
  function getWordPool(w: number): WordPair[] {
    const maxDiff = Math.min(w, 4) as 1 | 2 | 3 | 4;
    return WORD_PAIRS.filter((p) => p.difficulty <= maxDiff);
  }

  function spawnWord() {
    if (pausedRef.current) return;
    const pool = getWordPool(waveRef2.current);
    const pair = pool[Math.floor(Math.random() * pool.length)];
    const speed = (1.5 + waveRef2.current * 0.8 + pair.difficulty * 0.5) * (0.8 + Math.random() * 0.4);
    const id = ++wordIdRef.current;
    setWords((prev) => [
      ...prev,
      { id, pair, x: 5 + Math.random() * 70, y: -8, speed, hit: false, missed: false, explode: false },
    ]);
  }

  // ── RAF update loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;

    let animId: number;
    function update(ts: number) {
      if (pausedRef.current || pulseFrozenRef.current) {
        lastTsRef.current = ts;
        animId = requestAnimationFrame(update);
        return;
      }
      const dt = lastTsRef.current ? (ts - lastTsRef.current) / 1000 : 0.016;
      lastTsRef.current = ts;

      setWords((prev) => {
        let newLost = 0;
        const next = prev.map((w) => {
          if (w.hit || w.missed) return w;
          const ny = w.y + w.speed * dt * 10;
          if (ny >= 95) {
            newLost++;
            return { ...w, missed: true };
          }
          return { ...w, y: ny };
        });

        if (newLost > 0) {
          livesRef.current = Math.max(0, livesRef.current - newLost);
          setLives(livesRef.current);
          engine?.effects?.playWrong();
          if (livesRef.current <= 0) {
            setTimeout(endGame, 200);
          }
        }

        return next.filter((w) => !w.missed && !(w.hit && w.explode));
      });

      animId = requestAnimationFrame(update);
    }
    animId = requestAnimationFrame(update);
    rafRef.current = animId;
    return () => cancelAnimationFrame(animId);
  }, [phase, engine]);

  // ── Input matching ───────────────────────────────────────────────────────────
  const handleInput = useCallback(
    (value: string) => {
      setInput(value);
      const normalized = value.trim().toLowerCase();

      // Special: typing "häita" freezes all words for 2s
      if (normalized === 'häita' || normalized === 'haita') {
        setInput('');
        setHaitaFlash(true);
        setTimeout(() => setHaitaFlash(false), 2500);
        setComment(HAITA_COMMENTS.p6.mid[1]);
        // Freeze
        pulseFrozenRef.current = true;
        setPulseFrozen(true);
        setTimeout(() => {
          pulseFrozenRef.current = false;
          setPulseFrozen(false);
        }, 2000);
        return;
      }

      // Check against all active words
      setWords((prev) => {
        let matched = false;
        const next = prev.map((w) => {
          if (w.hit || matched) return w;
          if (w.pair.pt.toLowerCase() === normalized) {
            matched = true;
            return { ...w, hit: true, explode: true };
          }
          return w;
        });

        if (matched) {
          setInput('');
          engine?.effects?.playCorrect();
          streakRef.current++;
          setStreak(streakRef.current);
          scoreRef.current++;
          setScore(scoreRef.current);

          // Pulse power
          if (streakRef.current % WORDS_PER_PULSE === 0) {
            pulsesRef.current++;
            setPulses(pulsesRef.current);
          }

          // Win condition: survive wave 5
          if (waveRef2.current >= 5 && scoreRef.current >= 30) {
            setTimeout(handleWin, 400);
          }
        }

        return next;
      });
    },
    [engine]
  );

  // Tab = use pulse
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (pulsesRef.current > 0) {
        pulsesRef.current--;
        setPulses(pulsesRef.current);
        pulseFrozenRef.current = true;
        setPulseFrozen(true);
        setTimeout(() => {
          pulseFrozenRef.current = false;
          setPulseFrozen(false);
        }, 3000);
        engine?.effects?.playVeilOpen?.();
        setComment('O tempo congelou. Por um instante.');
      }
    }
  }

  // ── Wave management ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;

    // Spawn words
    const baseInterval = Math.max(800, 2200 - wave * 200);
    spawnRef.current = setInterval(spawnWord, baseInterval);

    // Wave progression
    waveRef.current = setInterval(() => {
      if (pausedRef.current) return;
      waveRef2.current++;
      setWave(waveRef2.current);
      setComment(HAITA_COMMENTS.p6.mid[0]);
    }, 30000);

    return () => {
      clearInterval(spawnRef.current);
      clearInterval(waveRef.current);
    };
  }, [phase, wave]);

  // ── Start / end ───────────────────────────────────────────────────────────────
  function startGame() {
    recordAttempt('p6');
    setAttempts((a) => a + 1);
    setWords([]);
    setInput('');
    setLives(MAX_LIVES);
    livesRef.current = MAX_LIVES;
    setScore(0);
    scoreRef.current = 0;
    setStreak(0);
    streakRef.current = 0;
    setPulses(0);
    pulsesRef.current = 0;
    setWave(1);
    waveRef2.current = 1;
    setComment(HAITA_COMMENTS.p6.start);
    setTimer(0);
    setHaitaFlash(false);
    pausedRef.current = false;
    pulseFrozenRef.current = false;
    lastTsRef.current = 0;
    setPhase('playing');
    setTimeout(() => inputRef.current?.focus(), 100);

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) setTimer((t) => t + 1);
    }, 1000);
  }

  function endGame() {
    clearInterval(timerRef.current);
    clearInterval(spawnRef.current);
    clearInterval(waveRef.current);
    setPhase('gameover');
    setComment(HAITA_COMMENTS.p6.fail);
    engine?.effects?.playWrong();
  }

  function handleWin() {
    clearInterval(timerRef.current);
    clearInterval(spawnRef.current);
    clearInterval(waveRef.current);
    setPhase('win');
    setComment(HAITA_COMMENTS.p6.win);
    setTimer((t) => {
      completeProva('p6', { score: scoreRef.current });
      return t;
    });
    onComplete?.();
    engine?.effects?.playCorrect();
  }

  useEffect(() => () => {
    clearInterval(timerRef.current);
    clearInterval(spawnRef.current);
    clearInterval(waveRef.current);
    cancelAnimationFrame(rafRef.current);
  }, []);

  // ─── Render ───────────────────────────────────────────────────────────────────

  if (phase === 'idle' || phase === 'gameover' || phase === 'win') {
    return (
      <ProvaLayout provaId="p6" nome="A Cifra Viva" haitaComment={comment} timer={timer} attempts={attempts}>
        <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
          {phase === 'win' && (
            <p className="font-display text-[var(--accent-gold)] tracking-widest uppercase">
              {score} palavras traduzidas.
            </p>
          )}
          {phase === 'gameover' && (
            <p className="font-display text-[var(--accent-crimson)] tracking-widest uppercase">
              A língua te venceu.
            </p>
          )}
          <p className="font-body italic text-[var(--text-secondary)] text-sm text-center max-w-xs">
            &quot;{comment}&quot;
          </p>
          <button
            onClick={startGame}
            className="border border-[var(--accent-blood)] px-5 py-2 font-mono text-xs text-[var(--accent-crimson)] hover:bg-[var(--accent-blood)] hover:text-white transition-colors tracking-widest uppercase"
          >
            {phase === 'idle' ? 'Começar' : 'Tentar novamente'}
          </button>
          <p className="font-mono text-[10px] text-[var(--text-secondary)] opacity-20 text-center">
            Digite a tradução em português · Tab = usar pulso · Surviva 5 ondas
          </p>
        </div>
      </ProvaLayout>
    );
  }

  return (
    <ProvaLayout
      provaId="p6"
      nome="A Cifra Viva"
      haitaComment={comment}
      timer={timer}
      attempts={attempts}
      isPaused={isPaused}
      onPause={() => { setIsPaused(true); pausedRef.current = true; }}
      onResume={() => { setIsPaused(false); pausedRef.current = false; }}
    >
      <div className="flex flex-col h-full">
        {/* HUD */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--accent-blood)] border-opacity-20">
          <LivesBar lives={lives} max={MAX_LIVES} />
          <div className="flex gap-3 items-center">
            <span className="font-mono text-xs text-[var(--accent-gold)] opacity-70">
              onda {wave} · {score} pts
            </span>
            {pulseFrozen && (
              <span className="font-mono text-xs text-[var(--accent-crimson)] animate-pulse">CONGELADO</span>
            )}
          </div>
          <PulsePower count={pulses} />
        </div>

        {/* Falling words area */}
        <div ref={containerRef} className="flex-1 relative overflow-hidden bg-[#050505]">
          {/* Häita flash */}
          <AnimatePresence>
            {haitaFlash && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.8, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5 }}
                className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                style={{ background: 'radial-gradient(circle at center, rgba(212,160,23,0.3) 0%, transparent 70%)' }}
              >
                <p className="font-display text-[var(--accent-gold)] text-xl tracking-widest">
                  Você disse meu nome.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {words.map((w) => (
              <motion.div
                key={w.id}
                initial={w.hit ? undefined : { opacity: 0, y: -20 }}
                animate={
                  w.hit
                    ? { opacity: [1, 0], scale: [1, 1.5], y: w.y - 5 }
                    : { opacity: 1 }
                }
                exit={{ opacity: 0 }}
                transition={w.hit ? { duration: 0.35 } : {}}
                className="absolute pointer-events-none"
                style={{ left: `${w.x}%`, top: `${w.y}%` }}
              >
                <span
                  className="font-display text-sm tracking-wider whitespace-nowrap"
                  style={{
                    color: w.hit
                      ? 'var(--accent-gold)'
                      : w.pair.difficulty >= 3
                      ? 'var(--accent-crimson)'
                      : 'var(--text-primary)',
                    opacity: pulseFrozen ? 0.5 : 1,
                    textShadow: w.hit ? '0 0 12px var(--accent-gold)' : 'none',
                  }}
                >
                  {w.pair.cat}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Danger zone */}
          <div className="absolute bottom-0 left-0 right-0 h-3 opacity-15" style={{ background: 'linear-gradient(to top, #8b0000, transparent)' }} />
        </div>

        {/* Input */}
        <div className="border-t border-[var(--accent-blood)] border-opacity-20 p-2 flex items-center gap-2">
          <span className="font-mono text-xs text-[var(--text-secondary)] opacity-40">›</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="tradução..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 bg-transparent font-mono text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] placeholder-opacity-30 outline-none caret-[var(--accent-gold)]"
          />
          <span className="font-mono text-[10px] text-[var(--text-secondary)] opacity-20">Tab=pulso</span>
        </div>
      </div>
    </ProvaLayout>
  );
}
