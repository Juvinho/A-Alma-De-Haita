'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ProvaLayout from '@/components/provas/ProvaLayout';
import { useProvaProgress } from '@/hooks/useProvaProgress';
import { useAudio } from '@/contexts/AudioContext';
import { HAITA_COMMENTS } from '@/data/provas-meta';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Element definitions ───────────────────────────────────────────────────────

const ELEMENTS = [
  { id: 'terra', color: '#8b4513', glow: '#a0520a', tone: 110, label: 'Terra', sublabel: 'sua pele' },
  { id: 'agua',  color: '#1a3a5c', glow: '#2255a0', tone: 220, label: 'Água',  sublabel: 'seu sangue' },
  { id: 'fogo',  color: '#8b0000', glow: '#cc1111', tone: 330, label: 'Fogo',  sublabel: 'sua fúria' },
  { id: 'vazio', color: '#1a0a2e', glow: '#3a1a5a', tone: 440, label: 'Vazio', sublabel: 'seu domínio' },
];

const MAX_ROUNDS = 12;
const TONE_DURATION = 0.3; // seconds
const PLAYBACK_DELAY = 0.6; // seconds between tones during playback

type Phase = 'idle' | 'playing' | 'input' | 'fail' | 'win';

// ─── Web Audio tone player ────────────────────────────────────────────────────

function playTone(ctx: AudioContext, freq: number, startTime: number) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.12, startTime + 0.015);
  gain.gain.setValueAtTime(0.12, startTime + TONE_DURATION - 0.04);
  gain.gain.linearRampToValueAtTime(0, startTime + TONE_DURATION);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + TONE_DURATION + 0.01);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EcosEscuridao({ onComplete }: { onComplete?: () => void }) {
  const { engine } = useAudio();
  const { completeProva, recordAttempt } = useProvaProgress();

  const [phase, setPhase] = useState<Phase>('idle');
  const [sequence, setSequence] = useState<number[]>([]);    // element indices
  const [activeEl, setActiveEl] = useState<number | null>(null);
  const [inputIdx, setInputIdx] = useState(0);
  const [round, setRound] = useState(0);
  const [timer, setTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [comment, setComment] = useState(HAITA_COMMENTS.p2.start);
  const [isPaused, setIsPaused] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const pausedRef = useRef(false);

  function getAudioCtx(): AudioContext {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }

  // ── Play a sequence ──────────────────────────────────────────────────────────
  const playSequence = useCallback(
    (seq: number[], onDone: () => void) => {
      const ctx = getAudioCtx();
      const startBase = ctx.currentTime + 0.2;

      seq.forEach((idx, i) => {
        const t = startBase + i * (TONE_DURATION + PLAYBACK_DELAY);
        const freq = ELEMENTS[idx].tone;

        // Twist: from round 6, last element gets tone ±15Hz
        const isTwist = seq.length >= 6 && i === seq.length - 1;
        const actualFreq = isTwist ? freq + (Math.random() > 0.5 ? 15 : -15) : freq;

        playTone(ctx, actualFreq, t);

        // Flash element
        setTimeout(() => setActiveEl(idx), Math.round(i * (TONE_DURATION + PLAYBACK_DELAY) * 1000 + 200));
        setTimeout(() => setActiveEl(null), Math.round(i * (TONE_DURATION + PLAYBACK_DELAY) * 1000 + 200 + 350));
      });

      const totalMs = (seq.length * (TONE_DURATION + PLAYBACK_DELAY)) * 1000 + 600;
      setTimeout(onDone, totalMs);
    },
    []
  );

  // ── Start new round ──────────────────────────────────────────────────────────
  function startRound(seq: number[]) {
    const newSeq = [...seq, Math.floor(Math.random() * 4)];
    setSequence(newSeq);
    setRound(newSeq.length);
    setInputIdx(0);
    setPhase('playing');

    const r = newSeq.length;
    if (r <= 4) setComment(HAITA_COMMENTS.p2.mid[0]);
    else if (r === 6) setComment(HAITA_COMMENTS.p2.mid[1]);   // twist
    else if (r >= 9) setComment(HAITA_COMMENTS.p2.mid[2]);

    playSequence(newSeq, () => {
      setPhase('input');
    });
  }

  // ── Start game ───────────────────────────────────────────────────────────────
  function startGame() {
    recordAttempt('p2');
    setAttempts((a) => a + 1);
    setTimer(0);
    setComment(HAITA_COMMENTS.p2.start);
    pausedRef.current = false;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) setTimer((t) => t + 1);
    }, 1000);

    startRound([]);
  }

  // ── Handle element tap ───────────────────────────────────────────────────────
  function handleTap(elIdx: number) {
    if (phase !== 'input' || pausedRef.current) return;

    // Flash
    setActiveEl(elIdx);
    setTimeout(() => setActiveEl(null), 300);

    // Play tone
    const ctx = getAudioCtx();
    playTone(ctx, ELEMENTS[elIdx].tone, ctx.currentTime);

    if (elIdx !== sequence[inputIdx]) {
      // Wrong
      engine?.effects?.playWrong();
      setPhase('fail');
      setComment(HAITA_COMMENTS.p2.fail);
      clearInterval(timerRef.current);
      return;
    }

    const nextIdx = inputIdx + 1;
    if (nextIdx === sequence.length) {
      // Round complete
      engine?.effects?.playCorrect();
      if (sequence.length >= MAX_ROUNDS) {
        // Win!
        clearInterval(timerRef.current);
        setPhase('win');
        setComment(HAITA_COMMENTS.p2.win);
        completeProva('p2', { score: sequence.length });
        onComplete?.();
      } else {
        setInputIdx(0);
        setTimeout(() => startRound(sequence), 800);
      }
    } else {
      setInputIdx(nextIdx);
    }
  }

  // ── Cleanup ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      audioCtxRef.current?.close();
    };
  }, []);

  // ── Visibility pause ─────────────────────────────────────────────────────────
  useEffect(() => {
    function onVis() {
      if (document.hidden && phase === 'input') {
        pausedRef.current = true;
        setIsPaused(true);
      }
    }
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [phase]);

  // ─── Render ──────────────────────────────────────────────────────────────────

  const mainComment = phase === 'idle' ? HAITA_COMMENTS.p2.start : comment;

  if (phase === 'idle' || phase === 'fail' || phase === 'win') {
    return (
      <ProvaLayout provaId="p2" nome="Ecos na Escuridão" haitaComment={mainComment} timer={timer} attempts={attempts}>
        <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
          {phase === 'win' && (
            <p className="font-display text-[var(--accent-gold)] tracking-widest uppercase">
              {MAX_ROUNDS} ecos. Perfeito.
            </p>
          )}
          {phase === 'fail' && (
            <p className="font-display text-[var(--accent-crimson)] tracking-widest uppercase">
              Sequência quebrada. Rodada {round}.
            </p>
          )}
          <p className="font-body italic text-[var(--text-secondary)] text-sm text-center max-w-xs">
            &quot;{mainComment}&quot;
          </p>
          <button
            onClick={startGame}
            className="border border-[var(--accent-blood)] px-5 py-2 font-mono text-xs text-[var(--accent-crimson)] hover:bg-[var(--accent-blood)] hover:text-white transition-colors tracking-widest uppercase"
          >
            {phase === 'idle' ? 'Começar' : 'Tentar novamente'}
          </button>
        </div>
      </ProvaLayout>
    );
  }

  return (
    <ProvaLayout
      provaId="p2"
      nome="Ecos na Escuridão"
      haitaComment={comment}
      timer={timer}
      attempts={attempts}
      isPaused={isPaused}
      onPause={() => { setIsPaused(true); pausedRef.current = true; }}
      onResume={() => { setIsPaused(false); pausedRef.current = false; }}
    >
      <div className="flex flex-col items-center justify-center h-full gap-6 px-4">
        {/* Round indicator */}
        <div className="flex gap-2">
          {Array.from({ length: MAX_ROUNDS }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < sequence.length
                  ? 'bg-[var(--accent-gold)]'
                  : 'bg-[var(--accent-blood)] opacity-30'
              }`}
            />
          ))}
        </div>

        {/* Status */}
        <p className="font-mono text-xs text-[var(--text-secondary)] opacity-60 tracking-widest">
          {phase === 'playing' ? 'OUÇA...' : `REPITA — ${sequence.length - inputIdx} restantes`}
        </p>

        {/* 4-panel D-pad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
          {/* Top: terra, fogo */}
          <div /> {/* empty */}
          <ElementPanel el={ELEMENTS[0]} active={activeEl === 0} onTap={() => handleTap(0)} disabled={phase !== 'input'} />
          <div />

          <ElementPanel el={ELEMENTS[1]} active={activeEl === 1} onTap={() => handleTap(1)} disabled={phase !== 'input'} />

          {/* Center eye */}
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border border-[var(--accent-gold)] opacity-30 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[var(--accent-gold)] opacity-50" />
            </div>
          </div>

          <ElementPanel el={ELEMENTS[2]} active={activeEl === 2} onTap={() => handleTap(2)} disabled={phase !== 'input'} />

          <div />
          <ElementPanel el={ELEMENTS[3]} active={activeEl === 3} onTap={() => handleTap(3)} disabled={phase !== 'input'} />
          <div />
        </div>

        {/* Input progress */}
        <div className="flex gap-1">
          {sequence.map((el, i) => (
            <div
              key={i}
              className="w-3 h-1 rounded-full transition-colors"
              style={{
                backgroundColor:
                  i < inputIdx
                    ? ELEMENTS[el].color
                    : 'rgba(100,50,50,0.3)',
              }}
            />
          ))}
        </div>
      </div>
    </ProvaLayout>
  );
}

// ─── Element panel ────────────────────────────────────────────────────────────

function ElementPanel({
  el,
  active,
  onTap,
  disabled,
}: {
  el: (typeof ELEMENTS)[0];
  active: boolean;
  onTap: () => void;
  disabled: boolean;
}) {
  return (
    <AnimatePresence>
      <motion.button
        onClick={onTap}
        disabled={disabled}
        animate={active ? { scale: 1.08 } : { scale: 1 }}
        transition={{ duration: 0.15 }}
        className="aspect-square w-full rounded-sm transition-all relative overflow-hidden"
        style={{
          backgroundColor: active ? el.glow : el.color,
          boxShadow: active ? `0 0 24px ${el.glow}` : 'none',
          opacity: disabled && !active ? 0.65 : 1,
          cursor: disabled ? 'default' : 'pointer',
        }}
        aria-label={el.label}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="font-display text-xs text-white/80 tracking-widest uppercase">
            {el.label}
          </span>
          <span className="font-body text-[10px] text-white/40 italic">
            {el.sublabel}
          </span>
        </div>
        {active && (
          <motion.div
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
            style={{ backgroundColor: el.glow }}
          />
        )}
      </motion.button>
    </AnimatePresence>
  );
}
