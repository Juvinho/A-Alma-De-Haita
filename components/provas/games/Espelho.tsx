'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ProvaLayout from '@/components/provas/ProvaLayout';
import { useProvaProgress } from '@/hooks/useProvaProgress';
import { useAudio } from '@/contexts/AudioContext';
import { HAITA_COMMENTS } from '@/data/provas-meta';

// ─── Level definitions ─────────────────────────────────────────────────────────

type MirrorMode = 'horizontal' | 'vertical' | 'rotational';

interface Rect { x: number; y: number; w: number; h: number }

interface Level {
  id: number;
  label: string;
  mirrorMode: MirrorMode;
  delay: number;   // ms of reflection delay
  obstacles: { left: Rect[]; right: Rect[] };
  startLeft: { x: number; y: number };
  startRight: { x: number; y: number };
  goalLeft: { x: number; y: number };
  goalRight: { x: number; y: number };
}

const LEVELS: Level[] = [
  // Levels 1-3: horizontal mirror (left↔right)
  {
    id: 1, label: 'Reflexo I', mirrorMode: 'horizontal', delay: 0,
    obstacles: { left: [{ x: 0.4, y: 0.3, w: 0.08, h: 0.4 }], right: [{ x: 0.4, y: 0.3, w: 0.08, h: 0.4 }] },
    startLeft: { x: 0.15, y: 0.5 }, startRight: { x: 0.85, y: 0.5 },
    goalLeft: { x: 0.8, y: 0.2 }, goalRight: { x: 0.2, y: 0.2 },
  },
  {
    id: 2, label: 'Reflexo II', mirrorMode: 'horizontal', delay: 0,
    obstacles: { left: [{ x: 0.2, y: 0.5, w: 0.55, h: 0.06 }], right: [{ x: 0.2, y: 0.2, w: 0.55, h: 0.06 }] },
    startLeft: { x: 0.1, y: 0.3 }, startRight: { x: 0.9, y: 0.7 },
    goalLeft: { x: 0.85, y: 0.7 }, goalRight: { x: 0.15, y: 0.3 },
  },
  {
    id: 3, label: 'Reflexo III', mirrorMode: 'horizontal', delay: 0,
    obstacles: { left: [{ x: 0.3, y: 0.1, w: 0.06, h: 0.6 }, { x: 0.55, y: 0.3, w: 0.06, h: 0.6 }], right: [{ x: 0.3, y: 0.3, w: 0.06, h: 0.6 }, { x: 0.55, y: 0.1, w: 0.06, h: 0.6 }] },
    startLeft: { x: 0.1, y: 0.8 }, startRight: { x: 0.9, y: 0.2 },
    goalLeft: { x: 0.8, y: 0.5 }, goalRight: { x: 0.2, y: 0.5 },
  },
  // Levels 4-6: horizontal + delay
  {
    id: 4, label: 'Eco I', mirrorMode: 'horizontal', delay: 300,
    obstacles: { left: [{ x: 0.35, y: 0.2, w: 0.08, h: 0.35 }], right: [{ x: 0.5, y: 0.45, w: 0.08, h: 0.35 }] },
    startLeft: { x: 0.1, y: 0.8 }, startRight: { x: 0.9, y: 0.2 },
    goalLeft: { x: 0.8, y: 0.2 }, goalRight: { x: 0.2, y: 0.8 },
  },
  {
    id: 5, label: 'Eco II', mirrorMode: 'horizontal', delay: 300,
    obstacles: { left: [{ x: 0.2, y: 0.4, w: 0.6, h: 0.06 }], right: [{ x: 0.2, y: 0.55, w: 0.6, h: 0.06 }] },
    startLeft: { x: 0.1, y: 0.2 }, startRight: { x: 0.9, y: 0.8 },
    goalLeft: { x: 0.85, y: 0.8 }, goalRight: { x: 0.15, y: 0.2 },
  },
  {
    id: 6, label: 'Eco III', mirrorMode: 'horizontal', delay: 300,
    obstacles: {
      left: [{ x: 0.25, y: 0.1, w: 0.06, h: 0.5 }, { x: 0.6, y: 0.4, w: 0.06, h: 0.5 }],
      right: [{ x: 0.35, y: 0.1, w: 0.06, h: 0.5 }, { x: 0.5, y: 0.4, w: 0.06, h: 0.5 }],
    },
    startLeft: { x: 0.1, y: 0.8 }, startRight: { x: 0.9, y: 0.8 },
    goalLeft: { x: 0.8, y: 0.1 }, goalRight: { x: 0.2, y: 0.1 },
  },
  // Levels 7-8: vertical mirror
  {
    id: 7, label: 'Inversão I', mirrorMode: 'vertical', delay: 0,
    obstacles: { left: [{ x: 0.1, y: 0.45, w: 0.7, h: 0.08 }], right: [{ x: 0.2, y: 0.45, w: 0.7, h: 0.08 }] },
    startLeft: { x: 0.5, y: 0.1 }, startRight: { x: 0.5, y: 0.9 },
    goalLeft: { x: 0.5, y: 0.85 }, goalRight: { x: 0.5, y: 0.15 },
  },
  {
    id: 8, label: 'Inversão II', mirrorMode: 'vertical', delay: 0,
    obstacles: {
      left: [{ x: 0.1, y: 0.3, w: 0.5, h: 0.06 }, { x: 0.35, y: 0.6, w: 0.5, h: 0.06 }],
      right: [{ x: 0.35, y: 0.35, w: 0.5, h: 0.06 }, { x: 0.15, y: 0.62, w: 0.5, h: 0.06 }],
    },
    startLeft: { x: 0.15, y: 0.1 }, startRight: { x: 0.85, y: 0.9 },
    goalLeft: { x: 0.85, y: 0.8 }, goalRight: { x: 0.15, y: 0.2 },
  },
  // Levels 9-10: rotational mirror
  {
    id: 9, label: 'Rotação I', mirrorMode: 'rotational', delay: 0,
    obstacles: { left: [{ x: 0.4, y: 0.2, w: 0.06, h: 0.6 }], right: [{ x: 0.3, y: 0.2, w: 0.6, h: 0.06 }] },
    startLeft: { x: 0.1, y: 0.5 }, startRight: { x: 0.5, y: 0.9 },
    goalLeft: { x: 0.8, y: 0.5 }, goalRight: { x: 0.5, y: 0.1 },
  },
  {
    id: 10, label: 'Rotação II', mirrorMode: 'rotational', delay: 0,
    obstacles: {
      left: [{ x: 0.2, y: 0.4, w: 0.5, h: 0.06 }, { x: 0.3, y: 0.1, w: 0.06, h: 0.4 }],
      right: [{ x: 0.4, y: 0.2, w: 0.5, h: 0.06 }, { x: 0.1, y: 0.3, w: 0.4, h: 0.06 }],
    },
    startLeft: { x: 0.1, y: 0.1 }, startRight: { x: 0.9, y: 0.9 },
    goalLeft: { x: 0.85, y: 0.85 }, goalRight: { x: 0.15, y: 0.15 },
  },
];

const PLAYER_R = 9;
const SPEED = 200; // px/s

// ─── Collision helpers ────────────────────────────────────────────────────────

function rectsOverlap(ax: number, ay: number, r: number, rect: Rect, cw: number, ch: number): boolean {
  const rx = rect.x * cw;
  const ry = rect.y * ch;
  const rw = rect.w * cw;
  const rh = rect.h * ch;
  return ax + r > rx && ax - r < rx + rw && ay + r > ry && ay - r < ry + rh;
}

// ─── Mirror transformation ────────────────────────────────────────────────────

function mirrorInput(
  dx: number, dy: number, mode: MirrorMode
): { dx: number; dy: number } {
  switch (mode) {
    case 'horizontal': return { dx: -dx, dy };
    case 'vertical': return { dx, dy: -dy };
    case 'rotational': return { dx: dy, dy: dx };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Espelho({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { engine } = useAudio();
  const { completeProva, recordAttempt, getProva } = useProvaProgress();

  const [levelIdx, setLevelIdx] = useState(0);
  const [phase, setPhase] = useState<'select' | 'playing' | 'level-win' | 'all-win'>('select');
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(new Set());
  const [comment, setComment] = useState(HAITA_COMMENTS.p8.start);
  const [timer, setTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const pausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());

  // Player positions (normalized 0-1 within each side)
  const leftRef = useRef({ x: 0.5, y: 0.5 });
  const rightRef = useRef({ x: 0.5, y: 0.5 });
  // Delayed input buffer for right player
  const inputBufferRef = useRef<Array<{ dx: number; dy: number; ts: number }>>([]);

  // Load saved progress
  useState(() => {
    const prog = getProva('p8');
    if (prog.details?.completedLevels) {
      setCompletedLevels(new Set(prog.details.completedLevels as number[]));
    }
  });

  const currentLevel = LEVELS[levelIdx];

  // ── Start level ──────────────────────────────────────────────────────────────
  const startLevel = useCallback((idx: number) => {
    const level = LEVELS[idx];
    setLevelIdx(idx);
    leftRef.current = { x: level.startLeft.x, y: level.startLeft.y };
    rightRef.current = { x: level.startRight.x, y: level.startRight.y };
    inputBufferRef.current = [];
    lastTsRef.current = 0;
    pausedRef.current = false;
    recordAttempt('p8');
    setAttempts((a) => a + 1);
    setTimer(0);
    setComment(HAITA_COMMENTS.p8.start);
    setPhase('playing');

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) setTimer((t) => t + 1);
    }, 1000);
  }, [recordAttempt]);

  // ── Canvas render loop ────────────────────────────────────────────────────────
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
      if (!canvas) return;
      if (pausedRef.current) { rafRef.current = requestAnimationFrame(render); return; }

      const dt = lastTsRef.current ? Math.min((ts - lastTsRef.current) / 1000, 0.05) : 0.016;
      lastTsRef.current = ts;
      const cw = canvas.width;
      const ch = canvas.height;
      const hw = cw / 2;

      const level = LEVELS[levelIdx];
      const left = leftRef.current;
      const right = rightRef.current;

      // ── Input ──
      const keys = keysRef.current;
      const up = keys.has('ArrowUp') || keys.has('w') || keys.has('W');
      const down = keys.has('ArrowDown') || keys.has('s') || keys.has('S');
      const lft = keys.has('ArrowLeft') || keys.has('a') || keys.has('A');
      const rgt = keys.has('ArrowRight') || keys.has('d') || keys.has('D');

      const rawDx = (rgt ? 1 : 0) - (lft ? 1 : 0);
      const rawDy = (down ? 1 : 0) - (up ? 1 : 0);

      const speedN = SPEED / Math.min(cw, ch);

      // Move left player
      const newLx = left.x + rawDx * speedN * dt;
      const newLy = left.y + rawDy * speedN * dt;
      const lClamp = { x: Math.max(0.02, Math.min(0.98, newLx)), y: Math.max(0.02, Math.min(0.98, newLy)) };
      const lHit = level.obstacles.left.some((o) => rectsOverlap(lClamp.x * hw, lClamp.y * ch, PLAYER_R, { ...o, x: o.x * hw / hw }, hw, ch));
      if (!lHit) leftRef.current = lClamp;

      // Queue input for delayed right
      if (rawDx !== 0 || rawDy !== 0) {
        inputBufferRef.current.push({ dx: rawDx, dy: rawDy, ts });
      }

      // Process delayed right input
      const { dx: mDx, dy: mDy } = mirrorInput(rawDx, rawDy, level.mirrorMode);
      let rDx = mDx;
      let rDy = mDy;

      if (level.delay > 0) {
        const delayed = inputBufferRef.current.filter((e) => ts - e.ts >= level.delay);
        if (delayed.length > 0) {
          const last = delayed[delayed.length - 1];
          const m = mirrorInput(last.dx, last.dy, level.mirrorMode);
          rDx = m.dx;
          rDy = m.dy;
        } else {
          rDx = 0; rDy = 0;
        }
        // Trim old
        inputBufferRef.current = inputBufferRef.current.filter((e) => ts - e.ts < level.delay + 500);
      }

      const newRx = right.x + rDx * speedN * dt;
      const newRy = right.y + rDy * speedN * dt;
      const rClamp = { x: Math.max(0.02, Math.min(0.98, newRx)), y: Math.max(0.02, Math.min(0.98, newRy)) };
      const rHit = level.obstacles.right.some((o) => rectsOverlap(rClamp.x * hw, rClamp.y * ch, PLAYER_R, { ...o, x: o.x * hw / hw }, hw, ch));

      if (lHit || rHit) {
        // Reset both
        leftRef.current = { x: level.startLeft.x, y: level.startLeft.y };
        rightRef.current = { x: level.startRight.x, y: level.startRight.y };
        inputBufferRef.current = [];
        engine?.effects?.playWrong();
        setComment(HAITA_COMMENTS.p8.mid[0]);
      } else {
        if (!rHit) rightRef.current = rClamp;
      }

      // ── Win check ──
      const goalLR = PLAYER_R / hw;
      const goalLH = PLAYER_R / ch;
      const leftWin = Math.abs(left.x - level.goalLeft.x) < goalLR * 3 && Math.abs(left.y - level.goalLeft.y) < goalLH * 3;
      const rightWin = Math.abs(right.x - level.goalRight.x) < goalLR * 3 && Math.abs(right.y - level.goalRight.y) < goalLH * 3;

      if (leftWin && rightWin) {
        handleLevelWin();
        return;
      }

      // ── DRAW ──
      ctx.clearRect(0, 0, cw, ch);

      // Backgrounds
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, hw - 1, ch);
      ctx.fillStyle = '#0f0308';
      ctx.fillRect(hw + 1, 0, hw - 1, ch);

      // Mirror line
      const mirrorGrad = ctx.createLinearGradient(hw - 2, 0, hw + 2, 0);
      mirrorGrad.addColorStop(0, 'rgba(212,160,23,0)');
      mirrorGrad.addColorStop(0.5, 'rgba(212,160,23,0.4)');
      mirrorGrad.addColorStop(1, 'rgba(212,160,23,0)');
      ctx.fillStyle = mirrorGrad;
      ctx.fillRect(hw - 2, 0, 4, ch);
      // Ripple
      const rippleY = (ts / 1000 * 60) % ch;
      ctx.fillStyle = 'rgba(212,160,23,0.15)';
      ctx.fillRect(hw - 1, rippleY - 30, 2, 60);

      function drawObstacle(rect: Rect, offX: number) {
        ctx.fillStyle = 'rgba(30,10,10,0.9)';
        ctx.fillRect(rect.x * hw + offX, rect.y * ch, rect.w * hw, rect.h * ch);
      }

      // Left obstacles
      level.obstacles.left.forEach((o) => drawObstacle(o, 0));
      // Right obstacles
      level.obstacles.right.forEach((o) => drawObstacle(o, hw));

      function drawGoal(nx: number, ny: number, offX: number, color: string) {
        const gx = nx * hw + offX;
        const gy = ny * ch;
        const pulse = 0.5 + 0.5 * Math.sin(ts / 400);
        ctx.beginPath();
        ctx.arc(gx, gy, PLAYER_R * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.3 + pulse * 0.4;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      drawGoal(level.goalLeft.x, level.goalLeft.y, 0, '#d4a017');
      drawGoal(level.goalRight.x, level.goalRight.y, hw, '#8b0000');

      function drawPlayer(nx: number, ny: number, offX: number, color: string) {
        const px = nx * hw + offX;
        const py = ny * ch;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, PLAYER_R * 1.4);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, PLAYER_R * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      drawPlayer(left.x, left.y, 0, 'rgba(212,160,23,0.95)');
      drawPlayer(right.x, right.y, hw, 'rgba(180,30,30,0.95)');

      // Labels
      ctx.fillStyle = 'rgba(212,160,23,0.15)';
      ctx.font = '9px monospace';
      ctx.fillText('VOCÊ', 6, 14);
      ctx.fillStyle = 'rgba(180,30,30,0.15)';
      ctx.fillText('SEU REFLEXO', hw + 6, 14);

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, [phase, levelIdx, engine]);

  // ── Win ───────────────────────────────────────────────────────────────────────
  function handleLevelWin() {
    clearInterval(timerRef.current);
    engine?.effects?.playCorrect();
    setComment(HAITA_COMMENTS.p8.win);

    setCompletedLevels((prev) => {
      const next = new Set(prev).add(levelIdx);
      if (next.size >= LEVELS.length) {
        completeProva('p8', { score: LEVELS.length, details: { completedLevels: Array.from(next) } });
        onComplete?.();
      } else {
        completeProva('p8', { score: next.size, details: { completedLevels: Array.from(next) } });
      }
      return next;
    });
  }

  // ── Keyboard ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;
    function down(e: KeyboardEvent) {
      keysRef.current.add(e.key);
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
      if (e.key === 'Escape') { setIsPaused((p) => { pausedRef.current = !p; return !p; }); }
    }
    function up(e: KeyboardEvent) { keysRef.current.delete(e.key); }
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [phase]);

  // ── Mobile joystick ───────────────────────────────────────────────────────────
  const joystickRef2 = useRef<{ sx: number; sy: number; active: boolean }>({ sx: 0, sy: 0, active: false });
  const [joyPos, setJoyPos] = useState<{ x: number; y: number } | null>(null);
  const [thumbP, setThumbP] = useState({ x: 0, y: 0 });
  const joystickThrottle = useRef<ReturnType<typeof setTimeout>>();

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    joystickRef2.current = { sx: t.clientX, sy: t.clientY, active: true };
    setJoyPos({ x: t.clientX, y: t.clientY });
    setThumbP({ x: 0, y: 0 });
  }

  function onTouchMove(e: React.TouchEvent) {
    if (!joystickRef2.current.active) return;
    const t = e.touches[0];
    const dx = t.clientX - joystickRef2.current.sx;
    const dy = t.clientY - joystickRef2.current.sy;
    const max = 40;
    setThumbP({ x: Math.max(-max, Math.min(max, dx)), y: Math.max(-max, Math.min(max, dy)) });

    clearTimeout(joystickThrottle.current);
    joystickThrottle.current = setTimeout(() => {
      const adx = Math.abs(dx);
      const ady = Math.abs(dy);
      if (adx < 10 && ady < 10) return;
      keysRef.current.clear();
      if (adx > ady) keysRef.current.add(dx > 0 ? 'ArrowRight' : 'ArrowLeft');
      else keysRef.current.add(dy > 0 ? 'ArrowDown' : 'ArrowUp');
    }, 50);
  }

  function onTouchEnd() {
    joystickRef2.current.active = false;
    setJoyPos(null);
    setThumbP({ x: 0, y: 0 });
    keysRef.current.clear();
  }

  // ── Cleanup ──────────────────────────────────────────────────────────────────
  useEffect(() => () => {
    clearInterval(timerRef.current);
    cancelAnimationFrame(rafRef.current);
  }, []);

  // ─── Render ──────────────────────────────────────────────────────────────────

  if (phase === 'select') {
    return (
      <ProvaLayout provaId="p8" nome="O Espelho" haitaComment={comment} timer={timer} attempts={attempts}>
        <div className="flex flex-col h-full overflow-y-auto p-4 gap-3">
          <p className="font-body italic text-[var(--text-secondary)] text-xs text-center">
            {completedLevels.size}/{LEVELS.length} níveis completados.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {LEVELS.map((l, i) => {
              const done = completedLevels.has(i);
              const locked = i > 0 && !completedLevels.has(i - 1) && !done;
              return (
                <button
                  key={l.id}
                  onClick={() => !locked && startLevel(i)}
                  disabled={locked}
                  className={`border px-3 py-2 text-left transition-colors ${
                    done ? 'border-[var(--accent-gold)]' : locked ? 'border-gray-800 opacity-30' : 'border-[var(--accent-blood)] hover:bg-[var(--accent-blood)]'
                  }`}
                >
                  <span className="font-display text-xs tracking-widest uppercase block" style={{ color: done ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                    {done ? '✦ ' : ''}{l.label}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-secondary)] opacity-40">
                    {l.mirrorMode}{l.delay ? ` +${l.delay}ms` : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </ProvaLayout>
    );
  }

  if (phase === 'level-win' || phase === 'all-win') {
    const nextIdx = levelIdx + 1;
    return (
      <ProvaLayout provaId="p8" nome="O Espelho" haitaComment={comment} timer={timer} attempts={attempts}>
        <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
          <p className="font-display text-[var(--accent-gold)] tracking-widest uppercase">
            {phase === 'all-win' ? 'Todos os reflexos resolvidos.' : `${LEVELS[levelIdx].label} — concluído.`}
          </p>
          <p className="font-body italic text-[var(--text-secondary)] text-sm text-center max-w-xs">
            &quot;{comment}&quot;
          </p>
          <div className="flex gap-3">
            <button onClick={() => setPhase('select')} className="border border-[var(--accent-blood)] px-4 py-2 font-mono text-xs text-[var(--accent-crimson)] hover:bg-[var(--accent-blood)] hover:text-white transition-colors tracking-widest uppercase">
              Ver níveis
            </button>
            {phase === 'level-win' && nextIdx < LEVELS.length && (
              <button onClick={() => startLevel(nextIdx)} className="border border-[var(--accent-gold)] px-4 py-2 font-mono text-xs text-[var(--accent-gold)] hover:bg-[var(--accent-blood)] hover:text-white transition-colors tracking-widest uppercase">
                Próximo →
              </button>
            )}
          </div>
        </div>
      </ProvaLayout>
    );
  }

  return (
    <ProvaLayout
      provaId="p8"
      nome="O Espelho"
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

        {/* Level label */}
        <div className="absolute top-2 left-0 right-0 flex justify-center pointer-events-none">
          <span className="font-mono text-xs text-[var(--text-secondary)] opacity-30">
            {currentLevel.label} · {currentLevel.mirrorMode}{currentLevel.delay ? ` +${currentLevel.delay}ms` : ''}
          </span>
        </div>

        {/* Mobile joystick */}
        {joyPos && (
          <div className="absolute pointer-events-none" style={{ left: joyPos.x - 40, top: joyPos.y - 40 }}>
            <div className="w-20 h-20 rounded-full border border-[var(--accent-blood)] opacity-40" />
            <div className="absolute w-8 h-8 rounded-full bg-[var(--accent-crimson)] opacity-60"
              style={{ top: '50%', left: '50%', transform: `translate(calc(-50% + ${thumbP.x}px), calc(-50% + ${thumbP.y}px))` }}
            />
          </div>
        )}

        <p className="absolute bottom-2 right-3 font-mono text-xs text-[var(--text-secondary)] opacity-20 hidden md:block">
          WASD / ↑↓←→
        </p>
      </div>
    </ProvaLayout>
  );
}
