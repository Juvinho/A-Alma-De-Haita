'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ProvaLayout from '@/components/provas/ProvaLayout';
import { useProvaProgress } from '@/hooks/useProvaProgress';
import { useAudio } from '@/contexts/AudioContext';
import { HAITA_COMMENTS } from '@/data/provas-meta';
import { generateMaze, mutateMaze, MazeData } from '@/lib/maze-generator';

// ─── Difficulty configs ────────────────────────────────────────────────────────

type Difficulty = 'fino' | 'denso' | 'cego';

const CONFIGS: Record<Difficulty, {
  label: string;
  w: number; h: number;
  pulseMs: number;
  fog: boolean;
  fogRadius: number;
  hideExit: boolean;
}> = {
  fino:  { label: 'Véu Fino',  w: 11, h: 15, pulseMs: 20000, fog: false, fogRadius: 4, hideExit: false },
  denso: { label: 'Véu Denso', w: 17, h: 21, pulseMs: 15000, fog: true,  fogRadius: 3, hideExit: false },
  cego:  { label: 'Véu Cego',  w: 21, h: 21, pulseMs: 10000, fog: true,  fogRadius: 2, hideExit: true  },
};

const CELL_SIZE = 24; // px per cell on desktop; scaled on mobile

const MID_COMMENTS = HAITA_COMMENTS.p1.mid;

// ─── Ember particle ───────────────────────────────────────────────────────────

interface Ember {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
}

function makeEmber(cw: number, ch: number): Ember {
  return {
    x: Math.random() * cw,
    y: Math.random() * ch + ch * 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -Math.random() * 0.8 - 0.2,
    life: 0,
    maxLife: 120 + Math.random() * 100,
    size: 1 + Math.random() * 2,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Labirinto({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { engine } = useAudio();
  const { completeProva, recordAttempt } = useProvaProgress();

  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [phase, setPhase] = useState<'select' | 'playing' | 'win'>('select');
  const [timer, setTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [comment, setComment] = useState(HAITA_COMMENTS.p1.start);
  const [isPaused, setIsPaused] = useState(false);

  // Game state refs (avoid stale closures in RAF)
  const mazeRef = useRef<MazeData | null>(null);
  const playerRef = useRef({ x: 0, y: 0 });
  const visitedRef = useRef<Set<string>>(new Set());
  const embersRef = useRef<Ember[]>([]);
  const pulseFlashRef = useRef(0); // flash intensity 0-1 after pulse
  const pulseChangedRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const difficultyRef = useRef<Difficulty>('fino');

  // Timers
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const commentTimerRef = useRef<ReturnType<typeof setInterval>>();
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const commentIdxRef = useRef(0);

  const setCommentCycled = useCallback(() => {
    const idx = commentIdxRef.current % MID_COMMENTS.length;
    setComment(MID_COMMENTS[idx]);
    commentIdxRef.current++;
  }, []);

  // ── Start game ──────────────────────────────────────────────────────────────
  function startGame(diff: Difficulty) {
    const cfg = CONFIGS[diff];
    difficultyRef.current = diff;
    const maze = generateMaze(cfg.w, cfg.h, Date.now());
    mazeRef.current = maze;
    playerRef.current = { x: 0, y: 0 };
    visitedRef.current = new Set(['0,0']);
    embersRef.current = [];
    pulseFlashRef.current = 0;
    pulseChangedRef.current = new Set();
    lastTimeRef.current = 0;
    commentIdxRef.current = 0;
    pausedRef.current = false;

    setAttempts((a) => a + 1);
    recordAttempt('p1');
    setTimer(0);
    setComment(HAITA_COMMENTS.p1.start);
    setPhase('playing');
    setIsPaused(false);

    // Timer
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) setTimer((t) => t + 1);
    }, 1000);

    // Comment rotation
    clearInterval(commentTimerRef.current);
    commentTimerRef.current = setInterval(() => {
      if (!pausedRef.current) setCommentCycled();
    }, 20000);

    // Pulse schedule
    schedulePulse(cfg.pulseMs);
  }

  function schedulePulse(ms: number) {
    clearTimeout(pulseTimerRef.current);
    pulseTimerRef.current = setTimeout(() => {
      if (mazeRef.current && !pausedRef.current) {
        const old = mazeRef.current;
        const next = mutateMaze(old, 0.15, Date.now());
        mazeRef.current = next;

        // Record changed cells for flash
        const changed = new Set<string>();
        for (let y = 0; y < old.height; y++) {
          for (let x = 0; x < old.width; x++) {
            for (let d = 0; d < 4; d++) {
              if (old.cells[y][x].walls[d] !== next.cells[y][x].walls[d]) {
                changed.add(`${x},${y}`);
                break;
              }
            }
          }
        }
        pulseChangedRef.current = changed;
        pulseFlashRef.current = 1;

        setComment(MID_COMMENTS[commentIdxRef.current % MID_COMMENTS.length]);
        commentIdxRef.current++;
      }
      const cfg = CONFIGS[difficultyRef.current];
      schedulePulse(cfg.pulseMs);
    }, ms);
  }

  // ── Canvas render loop ──────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    function resize() {
      if (!canvas || !wrapRef.current) return;
      canvas.width = wrapRef.current.clientWidth;
      canvas.height = wrapRef.current.clientHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrapRef.current!);

    function render(ts: number) {
      if (!canvas || !mazeRef.current) return;
      if (pausedRef.current) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }
      const dt = lastTimeRef.current ? Math.min(ts - lastTimeRef.current, 50) : 16;
      lastTimeRef.current = ts;

      const cw = canvas.width;
      const ch = canvas.height;
      const maze = mazeRef.current;
      const cfg = CONFIGS[difficultyRef.current];

      // Scale cell to fit
      const cellW = Math.min(CELL_SIZE, Math.floor(cw / maze.width));
      const cellH = Math.min(CELL_SIZE, Math.floor(ch / maze.height));
      const cell = Math.min(cellW, cellH);
      const offX = Math.floor((cw - maze.width * cell) / 2);
      const offY = Math.floor((ch - maze.height * cell) / 2);

      ctx.clearRect(0, 0, cw, ch);
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, cw, ch);

      const px = playerRef.current.x;
      const py = playerRef.current.y;

      // ── Draw cells ──
      for (let y = 0; y < maze.height; y++) {
        for (let x = 0; x < maze.width; x++) {
          const cx = offX + x * cell;
          const cy = offY + y * cell;

          // Fog of war
          if (cfg.fog) {
            const dist = Math.max(Math.abs(x - px), Math.abs(y - py));
            if (dist > cfg.fogRadius) continue;
          }

          const cell_ = maze.cells[y][x];
          const visited = visitedRef.current.has(`${x},${y}`);

          // Floor tint (visited cells slightly lighter)
          if (visited) {
            ctx.fillStyle = 'rgba(20,5,5,0.4)';
            ctx.fillRect(cx, cy, cell, cell);
          }

          // Changed cell flash
          const isChanged = pulseChangedRef.current.has(`${x},${y}`);
          if (isChanged && pulseFlashRef.current > 0) {
            ctx.fillStyle = `rgba(139,0,0,${pulseFlashRef.current * 0.35})`;
            ctx.fillRect(cx, cy, cell, cell);
          }

          // Walls
          ctx.strokeStyle = isChanged && pulseFlashRef.current > 0.3
            ? `rgba(200,0,0,${0.5 + pulseFlashRef.current * 0.5})`
            : '#5a0000';
          ctx.lineWidth = 1;
          ctx.beginPath();
          if (cell_.walls[0]) { ctx.moveTo(cx, cy); ctx.lineTo(cx + cell, cy); }         // top
          if (cell_.walls[1]) { ctx.moveTo(cx + cell, cy); ctx.lineTo(cx + cell, cy + cell); } // right
          if (cell_.walls[2]) { ctx.moveTo(cx, cy + cell); ctx.lineTo(cx + cell, cy + cell); } // bottom
          if (cell_.walls[3]) { ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + cell); }         // left
          ctx.stroke();
        }
      }

      // ── Exit portal ──
      const ex = maze.width - 1;
      const ey = maze.height - 1;
      const showExit = !cfg.hideExit ||
        (Math.abs(px - ex) <= 4 && Math.abs(py - ey) <= 4) ||
        (cfg.fog && Math.max(Math.abs(ex - px), Math.abs(ey - py)) <= cfg.fogRadius);

      if (showExit) {
        const exCx = offX + ex * cell + cell / 2;
        const eyCy = offY + ey * cell + cell / 2;
        const pulse = 0.5 + 0.5 * Math.sin(ts / 300);
        const grad = ctx.createRadialGradient(exCx, eyCy, 0, exCx, eyCy, cell * 0.8);
        grad.addColorStop(0, `rgba(180,0,0,${0.6 + pulse * 0.4})`);
        grad.addColorStop(1, 'rgba(100,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(exCx, eyCy, cell * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Player ──
      const plCx = offX + px * cell + cell / 2;
      const plCy = offY + py * cell + cell / 2;
      const plGrad = ctx.createRadialGradient(plCx, plCy, 0, plCx, plCy, cell * 0.55);
      plGrad.addColorStop(0, 'rgba(255, 215, 0, 0.95)');
      plGrad.addColorStop(0.5, 'rgba(212, 160, 23, 0.6)');
      plGrad.addColorStop(1, 'rgba(212, 160, 23, 0)');
      ctx.fillStyle = plGrad;
      ctx.beginPath();
      ctx.arc(plCx, plCy, cell * 0.55, 0, Math.PI * 2);
      ctx.fill();

      // ── Fog gradient over player ──
      if (cfg.fog) {
        const fogRadius = cfg.fogRadius * cell * 2;
        const fogGrad = ctx.createRadialGradient(plCx, plCy, fogRadius * 0.4, plCx, plCy, fogRadius);
        fogGrad.addColorStop(0, 'rgba(0,0,0,0)');
        fogGrad.addColorStop(1, 'rgba(0,0,0,0.95)');
        ctx.fillStyle = fogGrad;
        ctx.fillRect(0, 0, cw, ch);
        // Outer full black
        ctx.fillStyle = 'rgba(0,0,0,0.98)';
        // Clip: fill everything outside fog circle
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, cw, ch);
        ctx.arc(plCx, plCy, fogRadius, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.restore();
      }

      // ── Embers ──
      const targetEmbers = 6;
      while (embersRef.current.length < targetEmbers) {
        embersRef.current.push(makeEmber(cw, ch));
      }
      embersRef.current = embersRef.current.filter((e) => {
        e.x += e.vx;
        e.y += e.vy * (dt / 16);
        e.life++;
        const t = e.life / e.maxLife;
        if (t >= 1) return false;
        const alpha = t < 0.5 ? t * 2 : (1 - t) * 2;
        ctx.fillStyle = `rgba(200,80,20,${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      // ── Pulse flash decay ──
      if (pulseFlashRef.current > 0) {
        pulseFlashRef.current = Math.max(0, pulseFlashRef.current - dt / 1000);
        if (pulseFlashRef.current <= 0) pulseChangedRef.current.clear();
      }

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [phase]);

  // ── Keyboard controls ────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;

    function tryMove(dx: number, dy: number) {
      if (pausedRef.current || !mazeRef.current) return;
      const maze = mazeRef.current;
      const { x, y } = playerRef.current;
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= maze.width || ny >= maze.height) return;

      // Check wall
      const dirIndex = dx === 1 ? 1 : dx === -1 ? 3 : dy === 1 ? 2 : 0;
      if (maze.cells[y][x].walls[dirIndex]) return;

      playerRef.current = { x: nx, y: ny };
      visitedRef.current.add(`${nx},${ny}`);
      engine?.effects?.playHover();

      // Win check
      if (nx === maze.width - 1 && ny === maze.height - 1) {
        handleWin();
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setIsPaused((p) => { pausedRef.current = !p; return !p; }); return; }
      const map: Record<string, [number, number]> = {
        'ArrowUp': [0, -1], 'w': [0, -1], 'W': [0, -1],
        'ArrowDown': [0, 1], 's': [0, 1], 'S': [0, 1],
        'ArrowLeft': [-1, 0], 'a': [-1, 0], 'A': [-1, 0],
        'ArrowRight': [1, 0], 'd': [1, 0], 'D': [1, 0],
      };
      const move = map[e.key];
      if (move) { e.preventDefault(); tryMove(move[0], move[1]); }
    }

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, engine]);

  // ── Touch joystick ────────────────────────────────────────────────────────────
  const joystickRef = useRef<{ startX: number; startY: number; active: boolean }>({ startX: 0, startY: 0, active: false });
  const [joystickPos, setJoystickPos] = useState<{ x: number; y: number } | null>(null);
  const [thumbPos, setThumbPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const joystickMoveThrottle = useRef<ReturnType<typeof setTimeout>>();

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    joystickRef.current = { startX: t.clientX, startY: t.clientY, active: true };
    setJoystickPos({ x: t.clientX, y: t.clientY });
    setThumbPos({ x: 0, y: 0 });
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!joystickRef.current.active) return;
    const t = e.touches[0];
    const dx = t.clientX - joystickRef.current.startX;
    const dy = t.clientY - joystickRef.current.startY;
    const max = 40;
    setThumbPos({
      x: Math.max(-max, Math.min(max, dx)),
      y: Math.max(-max, Math.min(max, dy)),
    });

    // Move player by threshold
    clearTimeout(joystickMoveThrottle.current);
    joystickMoveThrottle.current = setTimeout(() => {
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);
      if (adx < 15 && ady < 15) return;
      if (adx > ady) {
        tryMoveTouch(dx > 0 ? 1 : -1, 0);
      } else {
        tryMoveTouch(0, dy > 0 ? 1 : -1);
      }
      joystickRef.current = { ...joystickRef.current, startX: t.clientX, startY: t.clientY };
      setThumbPos({ x: 0, y: 0 });
    }, 80);
  }

  function onTouchEnd() {
    joystickRef.current.active = false;
    setJoystickPos(null);
    setThumbPos({ x: 0, y: 0 });
  }

  function tryMoveTouch(dx: number, dy: number) {
    if (pausedRef.current || !mazeRef.current) return;
    const maze = mazeRef.current;
    const { x, y } = playerRef.current;
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= maze.width || ny >= maze.height) return;
    const dirIndex = dx === 1 ? 1 : dx === -1 ? 3 : dy === 1 ? 2 : 0;
    if (maze.cells[y][x].walls[dirIndex]) return;
    playerRef.current = { x: nx, y: ny };
    visitedRef.current.add(`${nx},${ny}`);
    engine?.effects?.playHover();
    if (nx === maze.width - 1 && ny === maze.height - 1) handleWin();
  }

  // ── Win ───────────────────────────────────────────────────────────────────────
  function handleWin() {
    clearInterval(timerRef.current);
    clearInterval(commentTimerRef.current);
    clearTimeout(pulseTimerRef.current);
    engine?.effects?.playCorrect();

    setTimer((t) => {
      const finalTime = t;
      const msg = finalTime < 60
        ? HAITA_COMMENTS.p1.winFast ?? HAITA_COMMENTS.p1.win
        : finalTime > 120
        ? HAITA_COMMENTS.p1.winSlow ?? HAITA_COMMENTS.p1.win
        : HAITA_COMMENTS.p1.win;
      setComment(msg);
      completeProva('p1', { time: finalTime });
      return finalTime;
    });

    setPhase('win');
    onComplete?.();
  }

  // ── Cleanup ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(commentTimerRef.current);
      clearTimeout(pulseTimerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // ── Visibility pause ─────────────────────────────────────────────────────────
  useEffect(() => {
    function onVisibility() {
      if (document.hidden && phase === 'playing') {
        pausedRef.current = true;
        setIsPaused(true);
      }
    }
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [phase]);

  // ─── Render ──────────────────────────────────────────────────────────────────

  if (phase === 'select') {
    return (
      <ProvaLayout provaId="p1" nome="O Labirinto dos Véus" haitaComment={HAITA_COMMENTS.p1.start} timer={0} attempts={attempts}>
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
          <p className="font-body italic text-[var(--text-secondary)] text-sm text-center max-w-xs">
            Escolha a intensidade da prova. Não há volta atrás.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            {(Object.keys(CONFIGS) as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => startGame(d)}
                className="w-full border border-[var(--accent-blood)] px-4 py-3 text-left hover:bg-[var(--accent-blood)] transition-colors group"
              >
                <span className="font-display text-xs text-[var(--accent-gold)] tracking-widest uppercase group-hover:text-white transition-colors">
                  {CONFIGS[d].label}
                </span>
                <p className="font-mono text-xs text-[var(--text-secondary)] mt-1 opacity-60">
                  {CONFIGS[d].w}×{CONFIGS[d].h} · pulso a cada {CONFIGS[d].pulseMs / 1000}s
                  {CONFIGS[d].fog ? ' · névoa' : ''}
                  {CONFIGS[d].hideExit ? ' · saída oculta' : ''}
                </p>
              </button>
            ))}
          </div>
        </div>
      </ProvaLayout>
    );
  }

  if (phase === 'win') {
    return (
      <ProvaLayout provaId="p1" nome="O Labirinto dos Véus" haitaComment={comment} timer={timer} attempts={attempts}>
        <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
          <p className="font-display text-[var(--accent-gold)] tracking-widest uppercase text-lg">Atravessado.</p>
          <p className="font-body italic text-[var(--text-secondary)] text-sm text-center max-w-xs">
            &quot;{comment}&quot;
          </p>
          <button
            onClick={() => { setPhase('select'); setTimer(0); }}
            className="border border-[var(--accent-blood)] px-5 py-2 font-mono text-xs text-[var(--accent-crimson)] hover:bg-[var(--accent-blood)] hover:text-white transition-colors tracking-widest uppercase"
          >
            Tentar novamente
          </button>
        </div>
      </ProvaLayout>
    );
  }

  return (
    <ProvaLayout
      provaId="p1"
      nome="O Labirinto dos Véus"
      haitaComment={comment}
      timer={timer}
      attempts={attempts}
      isPaused={isPaused}
      onPause={() => { setIsPaused(true); pausedRef.current = true; }}
      onResume={() => { setIsPaused(false); pausedRef.current = false; }}
    >
      <div
        ref={wrapRef}
        className="relative w-full h-full overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Mobile joystick */}
        {joystickPos && (
          <div
            className="absolute pointer-events-none"
            style={{ left: joystickPos.x - 40, top: joystickPos.y - 40 }}
          >
            <div className="w-20 h-20 rounded-full border border-[var(--accent-blood)] opacity-40" />
            <div
              className="absolute w-8 h-8 rounded-full bg-[var(--accent-crimson)] opacity-60"
              style={{
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${thumbPos.x}px), calc(-50% + ${thumbPos.y}px))`,
              }}
            />
          </div>
        )}

        {/* Keyboard hint (desktop only) */}
        <p className="absolute bottom-2 right-3 font-mono text-xs text-[var(--text-secondary)] opacity-20 hidden md:block">
          WASD / ↑↓←→
        </p>
      </div>
    </ProvaLayout>
  );
}
