'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { checkAnswer } from '@/lib/utils';
import type { Enigma } from '@/data/enigmas';

interface EnigmaInputProps {
  enigma: Enigma;
  hintsUsed: number;
  onCorrect: () => void;
  onHintRequest: () => void;
  eloName: string;
}

export default function EnigmaInput({
  enigma,
  hintsUsed,
  onCorrect,
  onHintRequest,
  eloName,
}: EnigmaInputProps) {
  const [value, setValue] = useState('');
  const [state, setState] = useState<'idle' | 'wrong' | 'correct'>('idle');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(hintsUsed);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    if (!value.trim()) return;

    const correct = checkAnswer(value, enigma.resposta, enigma.respostasAlternativas);

    if (correct) {
      setState('correct');
      setFeedback(enigma.sussurroDeHaita);
      window.dispatchEvent(new CustomEvent('haita-correct'));
      if (enigma.id === 'e20') window.dispatchEvent(new CustomEvent('haita-parousia'));
      setTimeout(onCorrect, 3500);
    } else {
      setState('wrong');
      setFeedback(enigma.punicao);
      window.dispatchEvent(new CustomEvent('haita-wrong'));
      // Mobile haptic feedback
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(200);
      }
      setTimeout(() => {
        setState('idle');
        setFeedback('');
        setValue('');
        inputRef.current?.focus();
      }, 2500);
    }
  }, [value, enigma, onCorrect]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleHint = () => {
    if (hintIndex >= enigma.dicas.length) return;
    const next = hintIndex + 1;
    setHintIndex(next);
    setShowHint(true);
    onHintRequest();
    window.dispatchEvent(new CustomEvent('haita-hint'));
  };

  const currentHint = enigma.dicas[hintIndex - 1];

  return (
    <div className={cn('w-full transition-all duration-300', state === 'wrong' && 'red-shake', state === 'correct' && 'gold-flash')}>
      {/* Input area */}
      {state !== 'correct' && (
        <div className="mb-4">
          <label className="block font-mono text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-2">
            Sua resposta
          </label>
          <div className="relative flex items-center">
            <span className="font-mono text-[var(--accent-crimson)] mr-2 text-sm">▶</span>
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKey}
              disabled={state === 'wrong'}
              className={cn(
                'terminal-input font-mono text-base',
                state === 'wrong' && 'border-[var(--error)] text-[var(--error)]'
              )}
              placeholder="Digite sua resposta..."
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
      )}

      {/* Buttons */}
      {state === 'idle' && (
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={handleSubmit}
            className="font-display text-xs tracking-widest uppercase px-6 py-3 border border-[var(--accent-crimson)] text-[var(--accent-crimson)] hover:bg-[var(--accent-blood)] hover:text-[var(--text-primary)] transition-all duration-200 hover:shadow-[0_0_15px_var(--glow-haita)]"
          >
            [ Responder ]
          </button>

          {hintIndex < enigma.dicas.length && (
            <button
              onClick={handleHint}
              className="font-mono text-xs text-[var(--text-secondary)] opacity-50 hover:opacity-80 transition-opacity underline underline-offset-4"
            >
              pedir misericórdia ({enigma.dicas.length - hintIndex} restante{enigma.dicas.length - hintIndex !== 1 ? 's' : ''})
            </button>
          )}
        </div>
      )}

      {/* Hint display */}
      <AnimatePresence>
        {showHint && currentHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 border-l-2 border-[var(--accent-blood)] bg-[#0a0505]"
          >
            <p className="font-mono text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-1">
              Sussurro da Deusa — Dica {hintIndex}
            </p>
            <p className="font-body italic text-[var(--text-primary)] text-sm">{currentHint}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback: wrong */}
      <AnimatePresence>
        {state === 'wrong' && feedback && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-4 border border-[var(--error)] bg-[#0a0000]"
          >
            <p className="font-body italic text-[var(--error)] text-base leading-relaxed">
              &ldquo;{feedback}&rdquo;
            </p>
            <p className="font-mono text-xs text-[var(--error)] opacity-50 mt-1 tracking-widest">
              — Häita
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback: correct */}
      <AnimatePresence>
        {state === 'correct' && feedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mt-4 p-6 border border-[var(--accent-gold)] bg-[#0a0800]"
            style={{ boxShadow: '0 0 30px #d4a01722, 0 0 60px #d4a01711' }}
          >
            <p className="font-display text-xs text-[var(--accent-gold)] uppercase tracking-widest mb-3">
              ✦ Véu Rasgado ✦
            </p>
            <p className="font-body italic text-[var(--text-primary)] text-lg leading-relaxed">
              &ldquo;{feedback}&rdquo;
            </p>
            {eloName && (
              <p className="font-mono text-xs text-[var(--accent-gold)] opacity-60 mt-2 tracking-widest">
                — Häita, para {eloName}
              </p>
            )}
            <p className="font-mono text-xs text-[var(--text-secondary)] mt-3 opacity-50">
              Retornando aos véus...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
