'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProvaLayout from '@/components/provas/ProvaLayout';
import { useProvaProgress } from '@/hooks/useProvaProgress';
import { useAudio } from '@/contexts/AudioContext';
import { HAITA_COMMENTS } from '@/data/provas-meta';
import { TEAR_PUZZLES, deriveClues, TearPuzzle } from '@/data/tear-puzzles';

// ─── Cell state ────────────────────────────────────────────────────────────────

type CellState = 'empty' | 'filled' | 'marked'; // marked = X (definitely empty)

// ─── Component ────────────────────────────────────────────────────────────────

export default function TearHaita({ onComplete }: { onComplete?: () => void }) {
  const { engine } = useAudio();
  const { completeProva, recordAttempt, getProva } = useProvaProgress();

  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [phase, setPhase] = useState<'select' | 'playing' | 'win-puzzle' | 'all-complete'>('select');
  const [grid, setGrid] = useState<CellState[][]>([]);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [comment, setComment] = useState(HAITA_COMMENTS.p4.start);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [completedPuzzles, setCompletedPuzzles] = useState<Set<string>>(new Set());
  const [shakeKey, setShakeKey] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const pausedRef = useRef(false);
  const dragFillRef = useRef<CellState | null>(null);

  const currentPuzzle = TEAR_PUZZLES[puzzleIdx];

  // ── Load saved progress ──────────────────────────────────────────────────────
  useState(() => {
    const prog = getProva('p4');
    if (prog.details?.completedPuzzles) {
      setCompletedPuzzles(new Set(prog.details.completedPuzzles as string[]));
    }
  });

  // ── Start puzzle ─────────────────────────────────────────────────────────────
  function startPuzzle(puzzle: TearPuzzle) {
    const empty: CellState[][] = puzzle.grid.map((row) => row.map(() => 'empty'));
    setGrid(empty);
    setErrors(new Set());
    setComment(HAITA_COMMENTS.p4.start);
    setPuzzleIdx(TEAR_PUZZLES.indexOf(puzzle));
    setPhase('playing');
    setTimer(0);
    recordAttempt('p4');
    setAttempts((a) => a + 1);
    pausedRef.current = false;

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) setTimer((t) => t + 1);
    }, 1000);
  }

  // ── Toggle cell ───────────────────────────────────────────────────────────────
  const toggleCell = useCallback(
    (row: number, col: number, rightClick = false) => {
      if (phase !== 'playing' || pausedRef.current) return;

      setGrid((prev) => {
        const next = prev.map((r) => [...r]);
        const current = next[row][col];

        if (rightClick) {
          next[row][col] = current === 'marked' ? 'empty' : 'marked';
        } else {
          if (dragFillRef.current !== null) {
            next[row][col] = dragFillRef.current;
          } else {
            next[row][col] = current === 'filled' ? 'empty' : 'filled';
            dragFillRef.current = next[row][col];
          }
        }

        // Validate immediately
        const puzzle = TEAR_PUZZLES[puzzleIdx];
        const expected = puzzle.grid[row][col] === 1 ? 'filled' : 'empty';
        const placed = next[row][col];

        if (placed === 'filled' && expected !== 'filled') {
          // Wrong fill
          setErrors((e) => new Set(e).add(`${row},${col}`));
          setComment(HAITA_COMMENTS.p4.mid[1]);
          setShakeKey((k) => k + 1);
          engine?.effects?.playWrong();
          // Revert
          next[row][col] = 'empty';
        } else if (placed === 'filled' && expected === 'filled') {
          engine?.effects?.playHover();
          setErrors((e) => { const s = new Set(e); s.delete(`${row},${col}`); return s; });
        }

        // Check completion
        const isDone = puzzle.grid.every((r, ri) =>
          r.every((cell, ci) => {
            if (cell === 1) return next[ri][ci] === 'filled';
            return true; // Don't require marking empty cells
          })
        );

        if (isDone) {
          setTimeout(() => handlePuzzleWin(puzzle.id), 300);
        }

        // Mid comment at 50%
        const filled = next.flat().filter((c) => c === 'filled').length;
        const total = puzzle.grid.flat().filter((c) => c === 1).length;
        if (filled === Math.floor(total / 2)) {
          setComment(HAITA_COMMENTS.p4.mid[0]);
        }

        return next;
      });
    },
    [phase, puzzleIdx, engine]
  );

  function handlePuzzleWin(puzzleId: string) {
    clearInterval(timerRef.current);
    engine?.effects?.playCorrect();
    setComment(HAITA_COMMENTS.p4.win);

    setCompletedPuzzles((prev) => {
      const next = new Set(prev).add(puzzleId);
      // All 10 done?
      if (next.size >= TEAR_PUZZLES.length) {
        setPhase('all-complete');
        completeProva('p4', { score: TEAR_PUZZLES.length, details: { completedPuzzles: Array.from(next) } });
        onComplete?.();
      } else {
        setPhase('win-puzzle');
        // Update saved progress
        completeProva('p4', { score: next.size, details: { completedPuzzles: Array.from(next) } });
      }
      return next;
    });
  }

  // ─── Clue rendering ───────────────────────────────────────────────────────────

  const renderClues = (clues: number[][], axis: 'row' | 'col', cellSize: number) => {
    const maxLen = Math.max(...clues.map((c) => c.length));
    return clues.map((group, i) => {
      const padded = [...Array(maxLen - group.length).fill(null), ...group];
      return (
        <div
          key={i}
          className={axis === 'row' ? 'flex gap-1 justify-end items-center' : 'flex flex-col justify-end items-center'}
          style={{ [axis === 'row' ? 'height' : 'width']: cellSize, [axis === 'row' ? 'width' : 'height']: maxLen * 18 }}
        >
          {padded.map((n, j) =>
            n === null ? (
              <span key={j} style={{ [axis === 'row' ? 'width' : 'height']: 16 }} />
            ) : (
              <span
                key={j}
                className="font-mono text-[11px] text-[var(--accent-gold)] opacity-80 leading-none"
                style={{ [axis === 'row' ? 'minWidth' : 'minHeight']: 16, textAlign: 'center' }}
              >
                {n}
              </span>
            )
          )}
        </div>
      );
    });
  };

  // ─── Phase: select ────────────────────────────────────────────────────────────

  if (phase === 'select') {
    return (
      <ProvaLayout provaId="p4" nome="O Tear de Häita" haitaComment={comment} timer={timer} attempts={attempts}>
        <div className="flex flex-col h-full overflow-y-auto p-4 gap-4">
          <p className="font-body italic text-[var(--text-secondary)] text-xs text-center">
            Escolha um tecido para tecer. {completedPuzzles.size}/{TEAR_PUZZLES.length} tecidos completados.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {TEAR_PUZZLES.map((p) => {
              const done = completedPuzzles.has(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => startPuzzle(p)}
                  className={`border px-3 py-2 text-left transition-colors ${
                    done
                      ? 'border-[var(--accent-gold)] bg-[#0a0800]'
                      : 'border-[var(--accent-blood)] hover:bg-[var(--accent-blood)]'
                  }`}
                >
                  <span className="font-display text-xs tracking-widest uppercase block" style={{ color: done ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                    {done ? '✦ ' : ''}{p.nome}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-secondary)] opacity-50">
                    {p.size}×{p.size}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </ProvaLayout>
    );
  }

  if (phase === 'win-puzzle' || phase === 'all-complete') {
    return (
      <ProvaLayout provaId="p4" nome="O Tear de Häita" haitaComment={comment} timer={timer} attempts={attempts}>
        <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
          {phase === 'all-complete' ? (
            <p className="font-display text-[var(--accent-gold)] tracking-widest uppercase text-center">
              Todos os véus tecidos.
            </p>
          ) : (
            <p className="font-display text-[var(--accent-gold)] tracking-widest uppercase">
              {currentPuzzle.nome} — Tecido.
            </p>
          )}
          <p className="font-body italic text-[var(--text-secondary)] text-sm text-center max-w-xs">
            &quot;{comment}&quot;
          </p>
          <button
            onClick={() => setPhase('select')}
            className="border border-[var(--accent-blood)] px-5 py-2 font-mono text-xs text-[var(--accent-crimson)] hover:bg-[var(--accent-blood)] hover:text-white transition-colors tracking-widest uppercase"
          >
            {phase === 'all-complete' ? 'Ver todos' : 'Próximo tecido'}
          </button>
        </div>
      </ProvaLayout>
    );
  }

  // ─── Phase: playing ───────────────────────────────────────────────────────────

  const puzzle = currentPuzzle;
  const { rows: rowClues, cols: colClues } = deriveClues(puzzle.grid);
  const CELL_PX = puzzle.size === 8 ? 32 : puzzle.size === 12 ? 24 : 18;

  return (
    <ProvaLayout
      provaId="p4"
      nome="O Tear de Häita"
      haitaComment={comment}
      timer={timer}
      attempts={attempts}
      isPaused={isPaused}
      onPause={() => { setIsPaused(true); pausedRef.current = true; }}
      onResume={() => { setIsPaused(false); pausedRef.current = false; }}
    >
      <div className="flex flex-col items-center justify-center h-full overflow-auto p-2">
        <p className="font-display text-xs text-[var(--accent-gold)] tracking-widest uppercase mb-3 opacity-60">
          {puzzle.nome}
        </p>

        {/* Grid + clues wrapper */}
        <AnimatePresence>
          <motion.div
            key={shakeKey}
            animate={shakeKey > 0 ? { x: [0, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.35 }}
            className="flex flex-col"
          >
            {/* Col clues + grid */}
            <div className="flex">
              {/* Corner spacer */}
              <div style={{ width: Math.max(...rowClues.map((r) => r.length)) * 18, height: Math.max(...colClues.map((c) => c.length)) * 14 }} />

              {/* Col clues */}
              <div className="flex">
                {renderClues(colClues, 'col', CELL_PX)}
              </div>
            </div>

            <div className="flex">
              {/* Row clues */}
              <div className="flex flex-col">
                {renderClues(rowClues, 'row', CELL_PX)}
              </div>

              {/* Grid cells */}
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${puzzle.size}, ${CELL_PX}px)`,
                  gridTemplateRows: `repeat(${puzzle.size}, ${CELL_PX}px)`,
                  userSelect: 'none',
                }}
                onPointerLeave={() => { dragFillRef.current = null; }}
                onPointerUp={() => { dragFillRef.current = null; }}
              >
                {grid.map((row, ri) =>
                  row.map((cell, ci) => {
                    const isError = errors.has(`${ri},${ci}`);
                    const isFilled = cell === 'filled';
                    const isMarked = cell === 'marked';

                    return (
                      <div
                        key={`${ri}-${ci}`}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          dragFillRef.current = null;
                          toggleCell(ri, ci, e.button === 2);
                        }}
                        onPointerEnter={(e) => {
                          if (e.buttons > 0) toggleCell(ri, ci);
                        }}
                        onContextMenu={(e) => { e.preventDefault(); toggleCell(ri, ci, true); }}
                        style={{
                          width: CELL_PX,
                          height: CELL_PX,
                          cursor: 'pointer',
                          border: '1px solid rgba(212,160,23,0.15)',
                          boxSizing: 'border-box',
                          position: 'relative',
                          backgroundColor: isFilled ? 'var(--accent-crimson)' : 'transparent',
                          boxShadow: isFilled ? 'inset 0 0 8px rgba(0,0,0,0.5)' : 'none',
                        }}
                      >
                        {isFilled && (
                          <div
                            style={{
                              position: 'absolute', inset: 0,
                              background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 4px)',
                            }}
                          />
                        )}
                        {isMarked && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[var(--text-secondary)] opacity-40" style={{ fontSize: CELL_PX * 0.5 }}>×</span>
                          </div>
                        )}
                        {isError && (
                          <div className="absolute inset-0 bg-red-600 opacity-50" />
                        )}
                        {/* Section borders (every 5 cells) */}
                        {ci % 5 === 0 && ci > 0 && (
                          <div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--accent-gold)] opacity-20" />
                        )}
                        {ri % 5 === 0 && ri > 0 && (
                          <div className="absolute top-0 left-0 right-0 h-px bg-[var(--accent-gold)] opacity-20" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <p className="font-mono text-[10px] text-[var(--text-secondary)] opacity-25 mt-3">
          clique: preencher · clique direito / toque longo: marcar vazio
        </p>
      </div>
    </ProvaLayout>
  );
}
