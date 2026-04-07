'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAudio } from '@/contexts/AudioContext';
import { PROVAS, isProvaUnlocked } from '@/data/provas-meta';
import { useProvaProgress } from '@/hooks/useProvaProgress';

// ─── Octagon positioning ───────────────────────────────────────────────────────

// 8 provas on an octagon. Angles spread evenly from the top.
function octagonPos(idx: number, r: number): { x: number; y: number } {
  const angle = (idx / 8) * Math.PI * 2 - Math.PI / 2;
  return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
}

// ─── Prova icons ──────────────────────────────────────────────────────────────

const ICONS: Record<string, React.ReactNode> = {
  maze: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path d="M3 3h5v5H3V3zM3 16h5v5H3v-5zM16 3h5v5h-5V3zM8 8v3h3M11 3v5M19 11v5h-5M8 16h3v3M16 16h3" />
    </svg>
  ),
  echo: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <circle cx="12" cy="12" r="2" />
      <path d="M7 12a5 5 0 0 1 5-5M12 7a5 5 0 0 1 5 5M5 12a7 7 0 0 1 7-7M12 5a7 7 0 0 1 7 7" />
    </svg>
  ),
  bridge: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path d="M2 17h20M2 17V9a10 10 0 0 1 20 0v8M6 17V13M18 17V13M10 17v-4M14 17v-4" />
    </svg>
  ),
  loom: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path d="M4 4h16v16H4V4zM4 9h16M4 14h16M9 4v16M14 4v16" />
    </svg>
  ),
  shadow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <circle cx="12" cy="8" r="4" />
      <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeDasharray="2 2" />
      <path d="M3 20c0-5 4-9 9-9" opacity="0.4" />
    </svg>
  ),
  cipher: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path d="M4 6h16M4 12h10M4 18h6" />
      <circle cx="19" cy="18" r="3" />
      <path d="M19 15v2M19 19v2" opacity="0.5" />
    </svg>
  ),
  choice: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path d="M12 3v6M12 9l-4 4M12 9l4 4M8 13v5M16 13v5" />
      <circle cx="12" cy="3" r="1.5" fill="currentColor" />
      <circle cx="8" cy="18" r="1.5" fill="currentColor" />
      <circle cx="16" cy="18" r="1.5" fill="currentColor" />
    </svg>
  ),
  mirror: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
      <path d="M12 3v18M7 7l-4 4 4 4M17 7l4 4-4 4" />
    </svg>
  ),
};

// ─── Eye that follows cursor ──────────────────────────────────────────────────

function EyeCenter({ cx, cy }: { cx: number; cy: number }) {
  const [pupil, setPupil] = useState({ x: 0, y: 0 });
  const eyeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!eyeRef.current) return;
      const rect = eyeRef.current.getBoundingClientRect();
      const ex = rect.left + rect.width / 2;
      const ey = rect.top + rect.height / 2;
      const dx = e.clientX - ex;
      const dy = e.clientY - ey;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const max = 10;
      setPupil({ x: (dx / dist) * Math.min(max, dist * 0.3), y: (dy / dist) * Math.min(max, dist * 0.3) });
    }
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={eyeRef}
      className="absolute flex items-center justify-center pointer-events-none"
      style={{ left: cx - 32, top: cy - 32, width: 64, height: 64 }}
    >
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border border-[var(--accent-gold)] opacity-20 animate-pulse" />
      {/* Iris */}
      <div className="w-10 h-10 rounded-full border border-[var(--accent-gold)] opacity-40 flex items-center justify-center">
        {/* Pupil */}
        <div
          className="w-4 h-4 rounded-full bg-[var(--accent-crimson)] opacity-60"
          style={{ transform: `translate(${pupil.x}px, ${pupil.y}px)` }}
        />
      </div>
    </div>
  );
}

// ─── Stats footer ─────────────────────────────────────────────────────────────

function StatsRow({ stats }: { stats: ReturnType<typeof useProvaProgress>['stats'] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
      {[
        { label: 'Labirinto', value: stats.bestLabyrinthTime ? `${Math.floor(stats.bestLabyrinthTime / 60)}:${String(stats.bestLabyrinthTime % 60).padStart(2, '0')}` : '—' },
        { label: 'Ecos', value: stats.bestEcosScore ?? '—' },
        { label: 'Sombras', value: stats.shadowsFound ? `${stats.shadowsFound}/10` : '—' },
        { label: 'Palavras', value: stats.wordTyped ?? '—' },
      ].map((s) => (
        <div key={s.label} className="border border-[var(--accent-blood)] border-opacity-20 px-2 py-1.5">
          <p className="font-mono text-[10px] text-[var(--text-secondary)] opacity-40 tracking-widest uppercase">{s.label}</p>
          <p className="font-mono text-xs text-[var(--accent-gold)] opacity-70">{String(s.value)}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main hub component ───────────────────────────────────────────────────────

export default function ProvaHub({ completedProvas }: { completedProvas: string[] }) {
  const { engine } = useAudio();
  const { all, stats } = useProvaProgress();
  const tearDetails = all['p4']?.details;
  const tearDone =
    Array.isArray((tearDetails as { completedPuzzles?: unknown })?.completedPuzzles) &&
    ((tearDetails as { completedPuzzles?: unknown[] }).completedPuzzles?.length ?? 0) >= 10;

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(300);

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      const s = Math.min(containerRef.current.clientWidth, containerRef.current.clientHeight, 500);
      setSize(s);
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!tearDone || typeof window === 'undefined') return;
    localStorage.setItem('haita-fragment-iii', 'true');
  }, [tearDone]);

  const r = size * 0.38;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex flex-col gap-8">
      {/* Octagon area */}
      <div ref={containerRef} className="relative mx-auto" style={{ width: size, height: size }}>
        {/* Background octagon outline */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox={`0 0 ${size} ${size}`}>
          <polygon
            points={Array.from({ length: 8 }, (_, i) => {
              const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
              return `${cx + Math.cos(a) * r * 1.15},${cy + Math.sin(a) * r * 1.15}`;
            }).join(' ')}
            fill="none"
            stroke="var(--accent-blood)"
            strokeWidth={1}
          />
        </svg>

        {/* Center eye */}
        <EyeCenter cx={cx} cy={cy} />

        {/* Prova nodes */}
        {PROVAS.map((prova, i) => {
          const pos = octagonPos(i, r);
          const x = cx + pos.x;
          const y = cy + pos.y;
          const completed = all[prova.id]?.completed ?? false;
          const unlocked = isProvaUnlocked(prova.id, completedProvas);

          return (
            <motion.div
              key={prova.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="absolute"
              style={{ left: x - 28, top: y - 28, width: 56, height: 56 }}
            >
              {unlocked ? (
                <Link
                  href={`/provas/${prova.id}`}
                  onClick={() => engine?.effects?.playClick()}
                  className="group w-full h-full flex flex-col items-center justify-center rounded-sm border transition-all"
                  style={{
                    borderColor: completed ? 'var(--accent-gold)' : 'var(--accent-blood)',
                    background: completed ? 'rgba(212,160,23,0.08)' : 'rgba(139,0,0,0.1)',
                    boxShadow: completed ? '0 0 20px rgba(212,160,23,0.2)' : 'none',
                  }}
                >
                  <span
                    className="transition-colors"
                    style={{ color: completed ? 'var(--accent-gold)' : 'var(--accent-crimson)' }}
                  >
                    {ICONS[prova.icone]}
                  </span>
                  {completed && (
                    <span className="font-mono text-[8px] text-[var(--accent-gold)] opacity-70 mt-0.5">✦</span>
                  )}
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                    <div className="bg-[#0a0a0a] border border-[var(--accent-blood)] px-2 py-1">
                      <p className="font-display text-[9px] text-[var(--text-primary)] tracking-widest uppercase">
                        {prova.nome}
                      </p>
                      {prova.id === 'p4' && tearDone && (
                        <p className="font-mono text-[9px] text-[var(--accent-gold)] opacity-80 mt-1 max-w-[220px] whitespace-normal leading-tight">
                          Fragmento III: O que completa a gratidao antes do espaco - duas letras que selam o testemunho.
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center rounded-sm border border-[#222]"
                  title="Bloqueado"
                >
                  <span className="text-gray-700 text-xs">⛒</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <StatsRow stats={stats} />
      </motion.div>
    </div>
  );
}
