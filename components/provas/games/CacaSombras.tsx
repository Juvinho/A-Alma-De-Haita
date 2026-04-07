'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProvaLayout from '@/components/provas/ProvaLayout';
import { useProvaProgress } from '@/hooks/useProvaProgress';
import { useAudio } from '@/contexts/AudioContext';
import { HAITA_COMMENTS } from '@/data/provas-meta';

// ─── Scene + anomaly definitions ──────────────────────────────────────────────

interface Anomaly {
  id: string;
  label: string;        // description for screen readers
  // Click region (% of container, 0-100)
  cx: number; cy: number; r: number;
  // CSS to apply to the "B side" element id
  targetId: string;
}

interface Scene {
  id: string;
  nome: string;
  anomalies: Anomaly[];
  render: (side: 'a' | 'b', found: Set<string>) => React.ReactNode;
}

// ─── Scene renderers ──────────────────────────────────────────────────────────

function CorridorScene(side: 'a' | 'b', found: Set<string>) {
  const shadow = side === 'b' && !found.has('s1_shadow');
  const quadro = side === 'b' && !found.has('s1_quadro');
  const porta = side === 'b' && !found.has('s1_porta');
  const janela = side === 'b' && !found.has('s1_janela');
  const numero = side === 'b' && !found.has('s1_numero');

  return (
    <div className="relative w-full h-full bg-[#0d0d0d] overflow-hidden" style={{ perspective: '400px' }}>
      {/* Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{ background: 'linear-gradient(to bottom, #1a1a1a, #111)' }} />
      {/* Ceiling */}
      <div className="absolute top-0 left-0 right-0 h-1/4" style={{ background: '#0a0a0a' }} />
      {/* Wall */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, #111 0%, #1a1a1a 50%, #111 100%)' }} />

      {/* Emergency light */}
      <div className="absolute top-[15%] left-[50%] w-4 h-4 rounded-full" style={{ background: '#ff000088', boxShadow: '0 0 20px #ff000066', transform: 'translateX(-50%)' }} />

      {/* Doors */}
      <div className="absolute left-[20%] bottom-[30%] w-[12%] h-[40%] bg-[#1a1a1a] border border-[#333]">
        <span className="absolute top-2 right-2 font-mono text-[8px] text-[#555]">307</span>
      </div>
      <div className="absolute right-[20%] bottom-[30%] w-[12%] h-[40%]" style={{ background: porta ? '#111' : '#1a1a1a', border: '1px solid #333', transform: porta ? 'perspective(200px) rotateY(-30deg)' : 'none' }}>
        <span className="absolute top-2 right-2 font-mono text-[8px] text-[#555]">{numero ? '370' : '307'}</span>
      </div>

      {/* Window with reflection */}
      <div className="absolute top-[20%] left-[50%] w-[15%] h-[25%] border border-[#333]" style={{ background: '#050818', transform: 'translateX(-50%)' }}>
        {janela && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-12 bg-[#ffffff08] rounded-sm" style={{ boxShadow: '0 0 8px #ffffff11' }} />
          </div>
        )}
      </div>

      {/* Frame on wall */}
      <div className="absolute top-[30%] left-[35%] w-[8%] h-[12%] border border-[#444]" style={{ transform: quadro ? 'rotate(2deg)' : 'none', background: '#0f0f0f' }} />

      {/* Shadow anomaly */}
      {shadow && (
        <div className="absolute bottom-[30%] left-[45%] w-4 h-24 opacity-40" style={{ background: 'linear-gradient(to bottom, transparent, #000)', transform: 'skewX(30deg)' }} />
      )}
    </div>
  );
}

function BeachScene(side: 'a' | 'b', found: Set<string>) {
  const extraStar = side === 'b' && !found.has('s2_star');
  const redMoon = side === 'b' && !found.has('s2_moon');
  const extraFoot = side === 'b' && !found.has('s2_footprint');
  const shadowNoOne = side === 'b' && !found.has('s2_shadow');
  const eyeHex = side === 'b' && !found.has('s2_eye_hex');

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: 'linear-gradient(to bottom, #050510 0%, #0a0a20 60%, #0a0808 100%)' }}>
      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <div key={i} className="absolute rounded-full bg-white"
          style={{ width: 1.5, height: 1.5, opacity: 0.4 + Math.random() * 0.5, left: `${(i * 5 + 3) % 100}%`, top: `${(i * 7 + 5) % 50}%` }} />
      ))}
      {extraStar && (
        <div className="absolute w-3 h-3 rounded-full" style={{ background: '#ff4444', boxShadow: '0 0 6px #ff4444', left: '68%', top: '18%', opacity: 0.8 }} />
      )}

      {/* Moon */}
      <div className="absolute top-[10%] right-[15%] w-10 h-10 rounded-full" style={{ background: redMoon ? '#8b0000' : '#e8e8cc', boxShadow: redMoon ? '0 0 20px #8b0000' : '0 0 20px #e8e8cc44' }} />

      {/* Sea */}
      <div className="absolute bottom-[25%] left-0 right-0 h-[20%]" style={{ background: 'linear-gradient(to bottom, #0a1a2a, #050d14)' }}>
        {/* Waves */}
        {[0, 1, 2].map((i) => (
          <div key={i} className="absolute left-0 right-0 h-2 rounded-full opacity-20"
            style={{
              top: `${20 + i * 25}%`,
              background: '#4488aa',
              transform: 'none',
            }} />
        ))}
        {/* Moon reflection */}
        <div className="absolute right-[15%] top-[20%] w-6 h-8 opacity-20 rounded-full" style={{ background: redMoon ? '#8b0000' : '#e8e8cc' }} />
      </div>

      {/* Sand */}
      <div className="absolute bottom-0 left-0 right-0 h-[25%]" style={{ background: 'linear-gradient(to bottom, #2a1f10, #1a1208)' }}>
        {/* Footprints */}
        {[20, 30, 40, 50].map((x) => (
          <div key={x} className="absolute w-3 h-1.5 rounded-full opacity-30 bg-[#0a0a0a]" style={{ left: `${x}%`, top: '30%' }} />
        ))}
        {extraFoot && (
          <div className="absolute w-3 h-1.5 rounded-full opacity-30 bg-[#0a0a0a]" style={{ left: '60%', top: '50%' }} />
        )}
      </div>

      {/* Shadow with no person */}
      {shadowNoOne && (
        <div className="absolute bottom-[25%] left-[40%] w-2 h-20 opacity-30" style={{ background: 'linear-gradient(to top, #000, transparent)', transform: 'skewX(-20deg)' }} />
      )}

      {/* Eye in hexagon anomaly */}
      {eyeHex && (
        <div className="absolute left-[30%] top-[57%] w-12 h-12 flex items-center justify-center opacity-70">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,8 82,26 82,62 50,80 18,62 18,26" fill="none" stroke="#d4a017" strokeWidth="3" opacity="0.8" />
            <ellipse cx="50" cy="44" rx="18" ry="10" fill="none" stroke="#d4a017" strokeWidth="3" />
            <circle cx="50" cy="44" r="5" fill="#d4a017" opacity="0.9" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ─── Scene definitions ────────────────────────────────────────────────────────

const SCENES: Scene[] = [
  {
    id: 's1',
    nome: 'Corredor da Varguën',
    anomalies: [
      { id: 's1_shadow', label: 'Sombra sem objeto', cx: 48, cy: 65, r: 6, targetId: '' },
      { id: 's1_quadro', label: 'Quadro levemente torto', cx: 35, cy: 36, r: 8, targetId: '' },
      { id: 's1_porta', label: 'Porta entreaberta', cx: 72, cy: 55, r: 8, targetId: '' },
      { id: 's1_janela', label: 'Reflexo estranho na janela', cx: 50, cy: 33, r: 8, targetId: '' },
      { id: 's1_numero', label: 'Número da sala mudou', cx: 74, cy: 33, r: 6, targetId: '' },
    ],
    render: CorridorScene,
  },
  {
    id: 's2',
    nome: 'Praia de Catatúnia',
    anomalies: [
      { id: 's2_star', label: 'Constelação a mais no céu', cx: 68, cy: 18, r: 6, targetId: '' },
      { id: 's2_moon', label: 'Lua vermelha no reflexo', cx: 82, cy: 12, r: 8, targetId: '' },
      { id: 's2_footprint', label: 'Pegada extra na areia', cx: 60, cy: 80, r: 6, targetId: '' },
      { id: 's2_shadow', label: 'Sombra sem dono', cx: 40, cy: 73, r: 8, targetId: '' },
      { id: 's2_eye_hex', label: 'Olho dentro de um hexágono', cx: 30, cy: 57, r: 9, targetId: '' },
    ],
    render: BeachScene,
  },
];

// ─── Total anomalies across all scenes ───────────────────────────────────────

const TOTAL_ANOMALIES = SCENES.reduce((acc, s) => acc + s.anomalies.length, 0);

// ─── Timer display ────────────────────────────────────────────────────────────

function TimerBar({ timeLeft, maxTime }: { timeLeft: number; maxTime: number }) {
  const pct = Math.max(0, timeLeft / maxTime);
  const hue = Math.floor(pct * 60); // 0=red, 60=yellow
  return (
    <div className="h-1 w-full bg-[var(--accent-blood)] opacity-30 relative overflow-hidden">
      <motion.div
        className="h-full absolute left-0 top-0"
        style={{ background: `hsl(${hue},80%,35%)`, width: `${pct * 100}%` }}
        animate={{ width: `${pct * 100}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

const MAX_TIME = 90; // seconds per scene

export default function CacaSombras({ onComplete }: { onComplete?: () => void }) {
  const { engine } = useAudio();
  const { completeProva, recordAttempt, getProva } = useProvaProgress();

  const [phase, setPhase] = useState<'select' | 'playing' | 'scene-fail' | 'scene-win' | 'all-complete'>('select');
  const [sceneIdx, setSceneIdx] = useState(0);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [totalFound, setTotalFound] = useState(0);
  const [wrongClick, setWrongClick] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [brightness, setBrightness] = useState(100);
  const [timer, setTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [comment, setComment] = useState(HAITA_COMMENTS.p5.start);
  const [completedScenes, setCompletedScenes] = useState<Set<string>>(new Set());
  const [foundMarkers, setFoundMarkers] = useState<Array<{ id: string; x: number; y: number }>>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [morseOverlay, setMorseOverlay] = useState<string | null>(null);

  const timeRef = useRef<ReturnType<typeof setInterval>>();
  const globalTimerRef = useRef<ReturnType<typeof setInterval>>();
  const pausedRef = useRef(false);

  const currentScene = SCENES[sceneIdx];

  // Load existing progress
  useState(() => {
    const prog = getProva('p5');
    if (prog.details?.completedScenes) {
      setCompletedScenes(new Set(prog.details.completedScenes as string[]));
    }
    if (prog.details?.totalFound) {
      setTotalFound(prog.details.totalFound as number);
    }
  });

  function startScene(idx: number) {
    setSceneIdx(idx);
    setFound(new Set());
    setFoundMarkers([]);
    setMorseOverlay(null);
    setTimeLeft(MAX_TIME);
    setBrightness(100);
    setComment(HAITA_COMMENTS.p5.start);
    setPhase('playing');
    recordAttempt('p5');
    setAttempts((a) => a + 1);
    pausedRef.current = false;

    clearInterval(timeRef.current);
    clearInterval(globalTimerRef.current);

    // Countdown
    timeRef.current = setInterval(() => {
      if (pausedRef.current) return;
      setTimeLeft((t) => {
        const next = t - 1;
        if (next <= 0) {
          clearInterval(timeRef.current);
          setPhase('scene-fail');
          setComment(HAITA_COMMENTS.p5.fail);
          engine?.effects?.playWrong();
          return 0;
        }
        // Every 15s without find → darken
        setBrightness((b) => Math.max(50, b - 5 / 15));
        return next;
      });
    }, 1000);

    // Global timer
    globalTimerRef.current = setInterval(() => {
      if (!pausedRef.current) setTimer((t) => t + 1);
    }, 1000);
  }

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (phase !== 'playing' || pausedRef.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = ((e.clientX - rect.left) / rect.width) * 100;
      const cy = ((e.clientY - rect.top) / rect.height) * 100;

      const scene = SCENES[sceneIdx];
      for (const a of scene.anomalies) {
        if (found.has(a.id)) continue;
        const dist = Math.sqrt((cx - a.cx) ** 2 + (cy - a.cy) ** 2);
        if (dist <= a.r) {
          // Found!
          engine?.effects?.playCorrect();
          const projectedTotalFound = totalFound + 1;

          if (a.id === 's2_eye_hex') {
            setMorseOverlay('. -- .   (espaco)');
            setComment('Entre uma palavra e outra, ha o vazio. E no vazio, estou eu.');
            if (typeof window !== 'undefined') {
              localStorage.setItem('haita-fragment-iv', ' ');
            }
            setTimeout(() => setMorseOverlay(null), 3200);
          }

          setFound((prev) => {
            const next = new Set(prev).add(a.id);
            const comment = next.size >= scene.anomalies.length * 0.5 ? HAITA_COMMENTS.p5.mid[0] : HAITA_COMMENTS.p5.start;
            setComment(comment);
            setFoundMarkers((m) => [...m, { id: a.id, x: cx, y: cy }]);
            setTotalFound(projectedTotalFound);

            if (next.size === scene.anomalies.length) {
              clearInterval(timeRef.current);
              setPhase('scene-win');
              setComment(HAITA_COMMENTS.p5.win);
              engine?.effects?.playVeilOpen?.();
              setCompletedScenes((cs) => {
                const ncs = new Set(cs).add(scene.id);
                if (ncs.size >= SCENES.length) {
                  setTimeout(() => {
                    setPhase('all-complete');
                    completeProva('p5', { score: TOTAL_ANOMALIES, details: { completedScenes: Array.from(ncs), totalFound: TOTAL_ANOMALIES } });
                    onComplete?.();
                  }, 1500);
                } else {
                  completeProva('p5', { score: next.size, details: { completedScenes: Array.from(ncs), totalFound: projectedTotalFound } });
                }
                return ncs;
              });
            }
            return next;
          });
          return;
        }
      }

      // Wrong click
      setWrongClick(true);
      setTimeLeft((t) => Math.max(0, t - 5));
      setComment(HAITA_COMMENTS.p5.mid[1]);
      engine?.effects?.playWrong();
      setTimeout(() => setWrongClick(false), 500);
    },
    [phase, sceneIdx, found, engine, completeProva, onComplete, totalFound]
  );

  // Cleanup
  useEffect(() => () => {
    clearInterval(timeRef.current);
    clearInterval(globalTimerRef.current);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────────

  if (phase === 'select') {
    return (
      <ProvaLayout provaId="p5" nome="Caça às Sombras" haitaComment={comment} timer={timer} attempts={attempts}>
        <div className="flex flex-col h-full overflow-y-auto p-4 gap-3">
          <p className="font-body italic text-[var(--text-secondary)] text-xs text-center">
            {completedScenes.size}/{SCENES.length} cenas inspecionadas. {totalFound}/{TOTAL_ANOMALIES} anomalias encontradas.
          </p>
          {SCENES.map((scene, i) => (
            <button
              key={scene.id}
              onClick={() => startScene(i)}
              className={`border px-3 py-3 text-left transition-colors ${
                completedScenes.has(scene.id)
                  ? 'border-[var(--accent-gold)]'
                  : 'border-[var(--accent-blood)] hover:bg-[var(--accent-blood)]'
              }`}
            >
              <span className="font-display text-xs tracking-widest uppercase" style={{ color: completedScenes.has(scene.id) ? 'var(--accent-gold)' : 'var(--text-primary)' }}>
                {completedScenes.has(scene.id) ? '✦ ' : ''}{scene.nome}
              </span>
              <p className="font-mono text-[10px] text-[var(--text-secondary)] opacity-40 mt-0.5">
                {scene.anomalies.length} anomalias · 90 segundos
              </p>
            </button>
          ))}
        </div>
      </ProvaLayout>
    );
  }

  if (phase === 'scene-fail' || phase === 'scene-win' || phase === 'all-complete') {
    return (
      <ProvaLayout provaId="p5" nome="Caça às Sombras" haitaComment={comment} timer={timer} attempts={attempts}>
        <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
          <p className="font-display text-[var(--accent-gold)] tracking-widest uppercase text-center">
            {phase === 'all-complete' ? 'Todas as anomalias encontradas.' : phase === 'scene-win' ? `${currentScene.nome} — limpa.` : 'Elas escaparam.'}
          </p>
          <p className="font-body italic text-[var(--text-secondary)] text-sm text-center max-w-xs">
            &quot;{comment}&quot;
          </p>
          <button
            onClick={() => setPhase('select')}
            className="border border-[var(--accent-blood)] px-5 py-2 font-mono text-xs text-[var(--accent-crimson)] hover:bg-[var(--accent-blood)] hover:text-white transition-colors tracking-widest uppercase"
          >
            {phase === 'all-complete' ? 'Ver cenas' : 'Próxima cena'}
          </button>
        </div>
      </ProvaLayout>
    );
  }

  // Playing
  return (
    <ProvaLayout
      provaId="p5"
      nome="Caça às Sombras"
      haitaComment={comment}
      timer={timer}
      attempts={attempts}
      isPaused={isPaused}
      onPause={() => { setIsPaused(true); pausedRef.current = true; }}
      onResume={() => { setIsPaused(false); pausedRef.current = false; }}
    >
      <div className="flex flex-col h-full">
        <TimerBar timeLeft={timeLeft} maxTime={MAX_TIME} />

        {/* Scene header */}
        <div className="flex items-center justify-between px-3 py-1.5">
          <span className="font-mono text-xs text-[var(--text-secondary)] opacity-40">
            {currentScene.nome}
          </span>
          <span className="font-mono text-xs text-[var(--accent-gold)] opacity-60">
            {found.size}/{currentScene.anomalies.length} encontradas
          </span>
        </div>

        {/* Game area — single scene (no side-by-side; anomalies are on this scene) */}
        <div
          className="flex-1 relative cursor-crosshair overflow-hidden"
          onClick={handleClick}
          style={{ filter: `brightness(${brightness}%)` }}
        >
          <motion.div
            animate={wrongClick ? { x: [0, -4, 4, -2, 2, 0] } : {}}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            {currentScene.render('b', found)}
          </motion.div>

          <AnimatePresence>
            {morseOverlay && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-2 border border-[var(--accent-gold)] bg-black/70"
              >
                <p className="font-mono text-xs text-[var(--accent-gold)] tracking-widest text-center">
                  {morseOverlay}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Found markers */}
          {foundMarkers.map((m) => (
            <motion.div
              key={m.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute pointer-events-none"
              style={{
                left: `${m.x}%`,
                top: `${m.y}%`,
                transform: 'translate(-50%,-50%)',
              }}
            >
              <div className="w-8 h-8 rounded-full border-2 border-[var(--accent-gold)] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-gold)]" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hint: anomalies list */}
        <div className="px-3 py-1 flex flex-wrap gap-2">
          {currentScene.anomalies.map((a) => (
            <span
              key={a.id}
              className="font-mono text-[10px] tracking-wide transition-colors"
              style={{ color: found.has(a.id) ? 'var(--accent-gold)' : 'var(--accent-blood)', opacity: found.has(a.id) ? 1 : 0.4 }}
            >
              {found.has(a.id) ? '✦' : '○'} {a.label}
            </span>
          ))}
        </div>
      </div>
    </ProvaLayout>
  );
}
