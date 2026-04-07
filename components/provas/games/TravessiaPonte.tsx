'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import ProvaLayout from '@/components/provas/ProvaLayout';
import { useProvaProgress } from '@/hooks/useProvaProgress';
import { useAudio } from '@/contexts/AudioContext';
import { HAITA_COMMENTS } from '@/data/provas-meta';

// ─── Physics constants ────────────────────────────────────────────────────────

const GRAVITY = 0.55;
const JUMP_VEL = -12;
const PLAYER_SPEED = 3.5;
const PLAYER_R = 7;
const LEVEL_WIDTH = 3200;
const GROUND_Y = 80; // px from bottom of canvas

// ─── Platform types ───────────────────────────────────────────────────────────

type PlatformType = 'stable' | 'unstable' | 'ghost' | 'moving' | 'liar';

interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  type: PlatformType;
  // Runtime state
  shakeOffset: number;
  shakeTimer: number;
  fallTimer: number;   // -1 = not activated; 0+ = counting to fall
  fallen: boolean;
  ghostVisible: boolean;
  ghostTimer: number;
  moveDir: number;     // for moving platforms
  moveRange: number;
  moveOrigin: number;
  moveT: number;
}

// ─── Seeded RNG ───────────────────────────────────────────────────────────────

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Level generation ─────────────────────────────────────────────────────────

function generateBridge(seed: number, canvasH: number): Platform[] {
  const rand = mulberry32(seed);
  const platforms: Platform[] = [];

  const BASE_Y = canvasH - GROUND_Y - 30; // baseline Y for platforms
  const JUMP_MAX_H = 160;    // max height difference per jump
  const JUMP_MAX_W = 180;    // max gap width

  let x = 60;
  const typeDistrib: PlatformType[] = [
    'stable', 'stable', 'stable', 'stable', 'stable',
    'unstable', 'unstable', 'unstable',
    'ghost', 'ghost', 'ghost',
    'moving', 'moving',
    'liar', 'liar',
  ];

  let idx = 0;
  while (x < LEVEL_WIDTH - 200) {
    const w = 60 + Math.floor(rand() * 60);
    const gapX = 40 + Math.floor(rand() * JUMP_MAX_W);
    const dy = (rand() - 0.5) * JUMP_MAX_H;
    const y = Math.max(
      canvasH * 0.25,
      Math.min(BASE_Y, (platforms[platforms.length - 1]?.y ?? BASE_Y) + dy)
    );

    // First 5 are always stable
    let type: PlatformType = 'stable';
    if (idx >= 5) {
      type = typeDistrib[Math.floor(rand() * typeDistrib.length)];
    }

    const isMoving = type === 'moving';
    platforms.push({
      x, y, w, h: 12, type,
      shakeOffset: 0, shakeTimer: 0, fallTimer: -1, fallen: false,
      ghostVisible: true, ghostTimer: 0,
      moveDir: rand() > 0.5 ? 1 : -1,
      moveRange: isMoving ? 40 + rand() * 60 : 0,
      moveOrigin: x,
      moveT: rand() * Math.PI * 2,
    });

    x += w + gapX;
    idx++;
  }

  return platforms;
}

// ─── Ember ────────────────────────────────────────────────────────────────────

interface FallingEmber {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number; size: number;
}

// ─── Comment lines ────────────────────────────────────────────────────────────

const DEATH_LINES = HAITA_COMMENTS.p3.mid;
let deathLineIdx = 0;

// ─── Component ────────────────────────────────────────────────────────────────

export default function TravessiaPonte({ onComplete }: { onComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const { engine } = useAudio();
  const { completeProva, recordAttempt } = useProvaProgress();

  const [phase, setPhase] = useState<'idle' | 'playing' | 'win'>('idle');
  const [timer, setTimer] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [comment, setComment] = useState(HAITA_COMMENTS.p3.start);
  const [isPaused, setIsPaused] = useState(false);

  const pausedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number>(0);

  // Physics state refs
  const playerRef = useRef({ x: 30, y: 200, vy: 0, grounded: false, canJump: true });
  const platformsRef = useRef<Platform[]>([]);
  const embersRef = useRef<FallingEmber[]>([]);
  const cameraXRef = useRef(0);
  const keysRef = useRef<Set<string>>(new Set());
  const deathsRef = useRef(0);

  // ── Start game ──────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    if (!canvasRef.current) return;
    const ch = canvasRef.current.height || 400;
    const seed = new Date().setHours(0, 0, 0, 0); // same seed per day
    platformsRef.current = generateBridge(seed, ch);
    playerRef.current = { x: 30, y: ch - GROUND_Y - 60, vy: 0, grounded: false, canJump: true };
    cameraXRef.current = 0;
    embersRef.current = [];
    deathsRef.current = 0;
    pausedRef.current = false;

    recordAttempt('p3');
    setAttempts((a) => a + 1);
    setDeaths(0);
    setTimer(0);
    setComment(HAITA_COMMENTS.p3.start);
    setPhase('playing');

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) setTimer((t) => t + 1);
    }, 1000);
  }, [recordAttempt]);

  // ── Die ────────────────────────────────────────────────────────────────────
  function die(canvasH: number) {
    engine?.effects?.playWrong();
    deathsRef.current++;
    setDeaths(deathsRef.current);

    const msg = DEATH_LINES[deathLineIdx % DEATH_LINES.length];
    deathLineIdx++;
    setComment(msg);

    // Respawn at start
    playerRef.current = { x: 30, y: canvasH - GROUND_Y - 60, vy: 0, grounded: false, canJump: true };
    cameraXRef.current = 0;

    // Reset fallen platforms
    platformsRef.current.forEach((p) => {
      p.fallen = false;
      p.fallTimer = -1;
      p.shakeOffset = 0;
    });
  }

  // ── Win ────────────────────────────────────────────────────────────────────
  function handleWin() {
    clearInterval(timerRef.current);
    engine?.effects?.playCorrect();
    setPhase('win');
    setComment(HAITA_COMMENTS.p3.win);
    setTimer((t) => {
      completeProva('p3', {
        time: t,
        details: { deaths: deathsRef.current },
      });
      return t;
    });
    onComplete?.();
  }

  // ── Render loop ─────────────────────────────────────────────────────────────
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

      const dt = lastTsRef.current ? Math.min((ts - lastTsRef.current) / 16, 3) : 1;
      lastTsRef.current = ts;
      const cw = canvas.width;
      const ch = canvas.height;

      const player = playerRef.current;
      const platforms = platformsRef.current;
      const keys = keysRef.current;

      // ── Input ──
      const left = keys.has('ArrowLeft') || keys.has('a') || keys.has('A');
      const right = keys.has('ArrowRight') || keys.has('d') || keys.has('D');
      if (left) player.x -= PLAYER_SPEED * dt;
      if (right) player.x += PLAYER_SPEED * dt;

      // ── Physics ──
      player.vy += GRAVITY * dt;
      player.y += player.vy * dt;

      // Ground (world bottom)
      const groundY = ch - GROUND_Y;
      if (player.y + PLAYER_R >= groundY) {
        // Fell to ground level — die
        die(ch);
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      // ── Platform collision ──
      player.grounded = false;
      for (const p of platforms) {
        if (p.fallen) continue;

        // Moving
        if (p.type === 'moving') {
          p.moveT += 0.025 * dt;
          p.x = p.moveOrigin + Math.sin(p.moveT) * p.moveRange;
        }

        // Ghost/liar visibility
        if (p.type === 'ghost') {
          p.ghostTimer += dt;
          p.ghostVisible = Math.floor(p.ghostTimer / 90) % 2 === 0;
        }

        // Liar: looks stable, is ghost (always transparent)
        const passThrough = (p.type === 'ghost' && !p.ghostVisible) || p.type === 'liar';
        if (passThrough) continue;

        // AABB from top
        if (
          player.vy >= 0 &&
          player.x + PLAYER_R > p.x &&
          player.x - PLAYER_R < p.x + p.w &&
          player.y + PLAYER_R >= p.y &&
          player.y + PLAYER_R <= p.y + p.h + player.vy + 2
        ) {
          player.y = p.y - PLAYER_R;
          player.vy = 0;
          player.grounded = true;
          player.canJump = true;

          // Unstable: shake then fall
          if (p.type === 'unstable' && p.fallTimer < 0) {
            p.fallTimer = 0;
          }
        }
      }

      // Update unstable platforms
      for (const p of platforms) {
        if (p.type === 'unstable' && p.fallTimer >= 0) {
          p.fallTimer += dt;
          p.shakeOffset = Math.sin(p.fallTimer * 0.5) * (p.fallTimer / 10);
          if (p.fallTimer > 90) {
            p.fallen = true;
          }
        }
      }

      // ── Bounds ──
      if (player.x < 0) player.x = 0;

      // ── Camera ──
      const targetCamX = player.x - cw * 0.3;
      cameraXRef.current += (targetCamX - cameraXRef.current) * 0.12 * dt;
      if (cameraXRef.current < 0) cameraXRef.current = 0;

      // ── Win check ──
      if (player.x >= LEVEL_WIDTH - 100) {
        handleWin();
        return;
      }

      // ── Embers (falling up-side-down) ──
      while (embersRef.current.length < 8) {
        embersRef.current.push({
          x: Math.random() * cw,
          y: 0,
          vx: (Math.random() - 0.5) * 0.5,
          vy: Math.random() * 1.5 + 0.5,
          life: 0,
          maxLife: 80 + Math.random() * 80,
          size: 1 + Math.random() * 1.5,
        });
      }

      // ── DRAW ──
      ctx.clearRect(0, 0, cw, ch);

      // Background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, ch);
      bg.addColorStop(0, '#0a0a0a');
      bg.addColorStop(1, '#200000');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, cw, ch);

      const camX = cameraXRef.current;

      // Platforms
      for (const p of platforms) {
        if (p.x - camX > cw + 50 || p.x - camX + p.w < -10) continue;
        const sx = p.x - camX + p.shakeOffset;
        const sy = p.y;

        const alpha = p.type === 'ghost'
          ? (p.ghostVisible ? 0.7 : 0.12)
          : p.type === 'liar'
          ? 0.85
          : 1;

        if (p.fallen) continue;

        const colors: Record<PlatformType, string> = {
          stable: '#8a8a8a',
          unstable: '#8b0000',
          ghost: '#6666aa',
          moving: '#d4a017',
          liar: '#8a8a8a', // looks like stable
        };

        ctx.globalAlpha = alpha;
        ctx.fillStyle = colors[p.type];
        ctx.fillRect(sx, sy, p.w, p.h);

        // Glow for moving
        if (p.type === 'moving') {
          ctx.shadowColor = '#d4a017';
          ctx.shadowBlur = 10;
          ctx.fillRect(sx, sy, p.w, p.h);
          ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = 1;
      }

      // Exit portal
      const exitX = LEVEL_WIDTH - 100 - camX;
      if (exitX < cw + 80 && exitX > -80) {
        const pulse = 0.6 + 0.4 * Math.sin(ts / 400);
        const portalGrad = ctx.createRadialGradient(exitX + 20, ch * 0.5, 0, exitX + 20, ch * 0.5, 50);
        portalGrad.addColorStop(0, `rgba(160,0,0,${pulse})`);
        portalGrad.addColorStop(1, 'rgba(80,0,0,0)');
        ctx.fillStyle = portalGrad;
        ctx.beginPath();
        ctx.arc(exitX + 20, ch * 0.5, 50, 0, Math.PI * 2);
        ctx.fill();
      }

      // Player
      const plGrad = ctx.createRadialGradient(
        player.x - camX, player.y, 0,
        player.x - camX, player.y, PLAYER_R * 1.5
      );
      plGrad.addColorStop(0, 'rgba(255,215,0,1)');
      plGrad.addColorStop(0.5, 'rgba(212,160,23,0.7)');
      plGrad.addColorStop(1, 'rgba(212,160,23,0)');
      ctx.fillStyle = plGrad;
      ctx.beginPath();
      ctx.arc(player.x - camX, player.y, PLAYER_R * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Embers (falling down from void)
      embersRef.current = embersRef.current.filter((e) => {
        e.x += e.vx;
        e.y += e.vy * dt;
        e.life++;
        if (e.y > ch || e.life > e.maxLife) return false;
        const t = e.life / e.maxLife;
        const a = t < 0.5 ? t * 2 : (1 - t) * 2;
        ctx.fillStyle = `rgba(180,50,10,${a * 0.4})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });

      // Progress bar
      const prog = Math.min(1, player.x / LEVEL_WIDTH);
      ctx.fillStyle = 'rgba(139,0,0,0.25)';
      ctx.fillRect(0, 0, cw, 3);
      ctx.fillStyle = '#d4a017';
      ctx.fillRect(0, 0, cw * prog, 3);

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [phase, engine]);

  // ── Keyboard ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;

    function onDown(e: KeyboardEvent) {
      keysRef.current.add(e.key);
      if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && playerRef.current.canJump) {
        e.preventDefault();
        playerRef.current.vy = JUMP_VEL;
        playerRef.current.grounded = false;
        playerRef.current.canJump = false;
        engine?.effects?.playHover();
      }
      if (e.key === 'Escape') {
        setIsPaused((p) => { pausedRef.current = !p; return !p; });
      }
    }
    function onUp(e: KeyboardEvent) { keysRef.current.delete(e.key); }
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); };
  }, [phase, engine]);

  // ── Mobile buttons ───────────────────────────────────────────────────────────
  function mobileKey(key: string, down: boolean) {
    if (down) keysRef.current.add(key);
    else keysRef.current.delete(key);
  }

  function mobileJump() {
    if (playerRef.current.canJump) {
      playerRef.current.vy = JUMP_VEL;
      playerRef.current.grounded = false;
      playerRef.current.canJump = false;
      engine?.effects?.playHover();
    }
  }

  // ── Cleanup ─────────────────────────────────────────────────────────────────
  useEffect(() => () => {
    clearInterval(timerRef.current);
    cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Visibility ──────────────────────────────────────────────────────────────
  useEffect(() => {
    function onVis() {
      if (document.hidden && phase === 'playing') { pausedRef.current = true; setIsPaused(true); }
    }
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [phase]);

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (phase === 'idle' || phase === 'win') {
    return (
      <ProvaLayout provaId="p3" nome="A Travessia da Ponte" haitaComment={comment} timer={timer} attempts={attempts}>
        <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
          {phase === 'win' && (
            <p className="font-display text-[var(--accent-gold)] tracking-widest uppercase">Atravessado.</p>
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
          <p className="font-mono text-xs text-[var(--text-secondary)] opacity-30">
            A/D · espaço para pular
          </p>
        </div>
      </ProvaLayout>
    );
  }

  return (
    <ProvaLayout
      provaId="p3"
      nome="A Travessia da Ponte"
      haitaComment={comment}
      timer={timer}
      attempts={attempts}
      isPaused={isPaused}
      onPause={() => { setIsPaused(true); pausedRef.current = true; }}
      onResume={() => { setIsPaused(false); pausedRef.current = false; }}
    >
      <div ref={wrapRef} className="relative w-full h-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* Deaths counter */}
        <div className="absolute top-2 right-3 font-mono text-xs text-[var(--text-secondary)] opacity-40">
          quedas: {deaths}
        </div>

        {/* Mobile controls */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-between items-end px-4 md:hidden pointer-events-none">
          <div className="flex gap-2 pointer-events-auto">
            <button
              onPointerDown={() => mobileKey('ArrowLeft', true)}
              onPointerUp={() => mobileKey('ArrowLeft', false)}
              onPointerLeave={() => mobileKey('ArrowLeft', false)}
              className="w-12 h-12 rounded-full border border-[var(--accent-blood)] flex items-center justify-center text-[var(--text-secondary)] opacity-60 active:bg-[var(--accent-blood)] select-none"
            >←</button>
            <button
              onPointerDown={() => mobileKey('ArrowRight', true)}
              onPointerUp={() => mobileKey('ArrowRight', false)}
              onPointerLeave={() => mobileKey('ArrowRight', false)}
              className="w-12 h-12 rounded-full border border-[var(--accent-blood)] flex items-center justify-center text-[var(--text-secondary)] opacity-60 active:bg-[var(--accent-blood)] select-none"
            >→</button>
          </div>
          <button
            onPointerDown={mobileJump}
            className="w-16 h-16 rounded-full border border-[var(--accent-gold)] flex items-center justify-center text-[var(--accent-gold)] opacity-60 active:bg-[var(--accent-blood)] pointer-events-auto select-none"
          >↑</button>
        </div>
      </div>
    </ProvaLayout>
  );
}
