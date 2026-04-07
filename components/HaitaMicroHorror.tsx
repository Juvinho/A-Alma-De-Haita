'use client';

import { useEffect, useRef } from 'react';
import { useHorror } from '@/contexts/HorrorContext';

// ─── 5.1 Ghost cursor shadow ─────────────────────────────────────────────────

function GhostCursor() {
  const ghostRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -200, y: -200 });
  const raf = useRef<number>(0);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      pos.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener('mousemove', onMove);

    let ghostX = -200, ghostY = -200;
    const DELAY = 0.08;

    function loop() {
      ghostX += (pos.current.x - ghostX) * DELAY;
      ghostY += (pos.current.y - ghostY) * DELAY;
      const el = ghostRef.current;
      if (el) {
        el.style.left = `${ghostX}px`;
        el.style.top = `${ghostY}px`;
      }
      raf.current = requestAnimationFrame(loop);
    }
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={ghostRef}
      className="fixed pointer-events-none z-[9997]"
      style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        background: '#8b0000',
        opacity: 0.07,
        transform: 'translate(-50%, -50%)',
        transition: 'none',
      }}
    />
  );
}

// ─── 5.4 Scroll Phantom ──────────────────────────────────────────────────────

function ScrollPhantom() {
  useEffect(() => {
    let lastPhantom = Date.now();

    const interval = setInterval(() => {
      if (Date.now() - lastPhantom > 15 * 60 * 1000) {
        lastPhantom = Date.now();
        window.scrollBy({ top: 2 + Math.random() * 1, behavior: 'smooth' });
      }
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  return null;
}

// ─── 5.5 Dynamic grain based on time of day ──────────────────────────────────

function DynamicGrain() {
  useEffect(() => {
    function updateGrain() {
      const h = new Date().getHours();
      let grain: number;
      let tintAlpha: number;

      if (h >= 6 && h < 18) {
        grain = 0.03;
        tintAlpha = 0;
      } else if (h >= 18 && h < 22) {
        grain = 0.08;
        tintAlpha = 0.01;
      } else if (h >= 22 || h < 2) {
        grain = 0.15;
        tintAlpha = 0.03;
      } else {
        // 2-6 (witching hours)
        grain = 0.25;
        tintAlpha = 0.06;
      }

      document.documentElement.style.setProperty('--grain-base', `${grain}`);

      const style = document.getElementById('haita-night-tint');
      if (tintAlpha > 0) {
        if (!style) {
          const el = document.createElement('style');
          el.id = 'haita-night-tint';
          el.textContent = `body::before { content: ''; position: fixed; inset: 0; background: rgba(80,0,0,${tintAlpha}); pointer-events: none; z-index: 999; }`;
          document.head.appendChild(el);
        } else {
          style.textContent = `body::before { content: ''; position: fixed; inset: 0; background: rgba(80,0,0,${tintAlpha}); pointer-events: none; z-index: 999; }`;
        }
      } else {
        if (style) style.textContent = '';
      }
    }

    updateGrain();
    const interval = setInterval(updateGrain, 60_000);
    return () => clearInterval(interval);
  }, []);

  return null;
}

// ─── 5.6 The Observer ─────────────────────────────────────────────────────────

function TheObserver() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const lastShow = useRef(0);

  useEffect(() => {
    if (window.innerWidth < 1440) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastShow.current < 20 * 60 * 1000) return;
      lastShow.current = now;

      const side = Math.random() > 0.5 ? leftRef.current : rightRef.current;
      if (!side) return;

      side.style.opacity = '0.05';
      let hiding = false;

      function hide() {
        if (!hiding) {
          hiding = true;
          if (side) side.style.opacity = '0';
        }
      }

      function onMove(e: MouseEvent) {
        // If mouse near the side, vanish
        if (e.clientX < 100 || e.clientX > window.innerWidth - 100) {
          hide();
          window.removeEventListener('mousemove', onMove);
        }
      }

      window.addEventListener('mousemove', onMove);
      setTimeout(() => {
        hide();
        window.removeEventListener('mousemove', onMove);
      }, 15_000);
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div
        ref={leftRef}
        className="fixed top-0 left-0 w-16 h-full pointer-events-none z-[80]"
        style={{
          opacity: 0,
          transition: 'opacity 3s ease',
          background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, transparent 100%)',
        }}
      />
      <div
        ref={rightRef}
        className="fixed top-0 right-0 w-16 h-full pointer-events-none z-[80]"
        style={{
          opacity: 0,
          transition: 'opacity 3s ease',
          background: 'linear-gradient(to left, rgba(0,0,0,0.8) 0%, transparent 100%)',
        }}
      />
    </>
  );
}

// ─── 5.2 Breathing text (CSS custom property approach) ────────────────────────

function BreathingText() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'haita-breathing';
    style.textContent = `
      @keyframes textBreathe {
        0%, 100% { letter-spacing: normal; }
        50% { letter-spacing: 0.3px; }
      }
      .font-body.italic {
        animation: textBreathe 8s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => { try { document.head.removeChild(style); } catch {} };
  }, []);
  return null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function HaitaMicroHorror() {
  const { fullHorror } = useHorror();

  // Always apply time-based grain and breathing text
  return (
    <>
      <DynamicGrain />
      <BreathingText />
      {fullHorror && (
        <>
          <GhostCursor />
          <ScrollPhantom />
          <TheObserver />
        </>
      )}
    </>
  );
}
