'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHorror } from '@/contexts/HorrorContext';
import { useAudio } from '@/contexts/AudioContext';
import { usePathname } from 'next/navigation';

// ─── 2.1 The Eye ─────────────────────────────────────────────────────────────

function TheEye() {
  const [visible, setVisible] = useState(false);
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [mouseLocal, setMouseLocal] = useState({ x: 0, y: 0 });
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) return;
    if (sessionStorage.getItem('haita-eye-shown')) return;

    function resetIdle() {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (shown.current) return;

      idleTimer.current = setTimeout(() => {
        if (shown.current) return;
        shown.current = true;
        sessionStorage.setItem('haita-eye-shown', '1');
        const x = window.innerWidth - 80;
        const y = window.innerHeight - 80;
        setEyePos({ x, y });
        setVisible(true);
      }, 90_000);
    }

    function onMove(e: MouseEvent) {
      setMouseLocal({ x: e.clientX, y: e.clientY });
      if (visible) {
        // Hide on interaction after appearing
        setVisible(false);
      } else {
        resetIdle();
      }
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('click', resetIdle);
    resetIdle();

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('click', resetIdle);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [visible]);

  // Compute pupil rotation to follow cursor
  const dx = mouseLocal.x - eyePos.x;
  const dy = mouseLocal.y - eyePos.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const dist = Math.min(Math.sqrt(dx * dx + dy * dy) / 200, 1) * 4;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 5, ease: 'easeIn', exit: { duration: 3 } }}
          className="fixed pointer-events-none z-[150] select-none"
          style={{ left: eyePos.x - 24, top: eyePos.y - 24 }}
        >
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            {/* Outer shape */}
            <ellipse cx="24" cy="24" rx="20" ry="12" stroke="#8b0000" strokeWidth="1"/>
            {/* Iris */}
            <circle cx="24" cy="24" r="8" fill="#1a0000" stroke="#8b0000" strokeWidth="0.5"/>
            {/* Pupil — moves with mouse */}
            <circle
              cx={24 + Math.cos(angle * Math.PI / 180) * dist}
              cy={24 + Math.sin(angle * Math.PI / 180) * dist}
              r="4"
              fill="#8b0000"
            />
            {/* Catchlight */}
            <circle
              cx={24 + Math.cos(angle * Math.PI / 180) * dist + 1.5}
              cy={24 + Math.sin(angle * Math.PI / 180) * dist - 1.5}
              r="1"
              fill="#cc0000"
              opacity="0.6"
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── 2.2 Ghost Text ──────────────────────────────────────────────────────────

const GHOST_PHRASES = [
  'Você está perdendo a minha paciência.',
  'Três vezes. A mesma pergunta. A mesma ignorância.',
  'Eu sinto sua frustração. Ela me alimenta.',
  'Continue errando. Eu tenho toda a eternidade.',
];

function GhostText({ triggerCount }: { triggerCount: number }) {
  const [visible, setVisible] = useState(false);
  const [phrase, setPhrase] = useState('');
  const prevCount = useRef(0);

  useEffect(() => {
    if (triggerCount >= 3 && triggerCount !== prevCount.current && triggerCount % 3 === 0) {
      prevCount.current = triggerCount;
      setPhrase(GHOST_PHRASES[Math.floor(Math.random() * GHOST_PHRASES.length)]);

      const onScroll = () => {
        setVisible(true);
        window.removeEventListener('scroll', onScroll);
        setTimeout(() => setVisible(false), 8000);
      };
      window.addEventListener('scroll', onScroll, { once: true });
    }
  }, [triggerCount]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, exit: { duration: 1.5 } }}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[140] pointer-events-none text-center px-8"
        >
          <p
            className="font-body italic text-base leading-relaxed"
            style={{ color: '#9a3030' }}
          >
            {phrase}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── 2.4 Possessed Cursor ────────────────────────────────────────────────────

function PossessedCursor({ corruptionLevel }: { corruptionLevel: number }) {
  const [possessing, setPossessing] = useState(false);
  const lastPossession = useRef(0);
  const cursorRef = useRef<HTMLDivElement>(null);
  const realPos = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);

  useEffect(() => {
    if (corruptionLevel <= 70) return;

    const CHECK_INTERVAL = 5 * 60 * 1000;
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastPossession.current > CHECK_INTERVAL) {
        lastPossession.current = now;
        setPossessing(true);
        setTimeout(() => setPossessing(false), 3000 + Math.random() * 2000);
      }
    }, 30_000);

    return () => clearInterval(interval);
  }, [corruptionLevel]);

  useEffect(() => {
    if (!possessing) return;

    let prevX = -100, prevY = -100;
    let offX = 0, offY = 0;

    function onMove(e: MouseEvent) {
      realPos.current = { x: e.clientX, y: e.clientY };
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      offX += -dx * 0.3;
      offY += -dy * 0.3;
      prevX = e.clientX;
      prevY = e.clientY;
    }

    function loop() {
      const el = cursorRef.current;
      if (el) {
        offX *= 0.92;
        offY *= 0.92;
        el.style.left = `${realPos.current.x + offX}px`;
        el.style.top = `${realPos.current.y + offY}px`;
      }
      raf.current = requestAnimationFrame(loop);
    }

    window.addEventListener('mousemove', onMove);
    raf.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [possessing]);

  if (!possessing) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[9998]"
      style={{
        width: 12,
        height: 12,
        background: '#8b0000',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 10px #ff1a1a88',
        transition: 'none',
      }}
    />
  );
}

// ─── 2.5 Scroll Reflex ───────────────────────────────────────────────────────

function ScrollReflex({ audioActive }: { audioActive: boolean }) {
  const [flash, setFlash] = useState(false);
  const shown = useRef(false);
  const lastScroll = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(Date.now());

  useEffect(() => {
    if (shown.current) return;
    if (sessionStorage.getItem('haita-scroll-flash')) return;

    function onScroll() {
      if (shown.current) return;
      const now = Date.now();
      const currentY = window.scrollY;
      const dt = now - lastTime.current;
      const dy = Math.abs(currentY - lastY.current);

      if (dt > 0 && dy / dt > 3 && dy > 150) {
        shown.current = true;
        sessionStorage.setItem('haita-scroll-flash', '1');
        setFlash(true);
        setTimeout(() => setFlash(false), 200);
      }

      lastY.current = currentY;
      lastTime.current = now;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {flash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.04, exit: { duration: 0.15 } }}
          className="fixed inset-0 z-[9990] flex items-center justify-center pointer-events-none"
          style={{ background: 'rgba(10, 0, 0, 0.85)' }}
        >
          <p
            className="font-display text-3xl md:text-5xl tracking-widest text-center"
            style={{ color: '#4a0000' }}
          >
            EU ESTOU EMBAIXO DE TUDO
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── 2.6 Screenshot detection ────────────────────────────────────────────────

function ScreenshotDetector() {
  const [message, setMessage] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isPrint = e.key === 'PrintScreen';
      const isMacShot = e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key);
      if (isPrint || isMacShot) {
        setMessage(true);
        setTimeout(() => setMessage(false), 5000);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[160] pointer-events-none"
        >
          <p className="font-body italic text-xs text-[var(--accent-crimson)] opacity-60 tracking-widest">
            Capturando evidências? Eu sou a evidência.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── 2.3 Identity Glitch (on /despertar) ─────────────────────────────────────

function IdentityGlitch() {
  const pathname = usePathname();
  const [glitchActive, setGlitchActive] = useState(false);
  const hasRun = useRef(false);

  useEffect(() => {
    if (pathname !== '/despertar') return;
    if (hasRun.current) return;

    const eloName = localStorage.getItem('haita_progress')
      ? JSON.parse(localStorage.getItem('haita_progress')!).eloName
      : '';

    if (!eloName) return;
    hasRun.current = true;

    // Dispatch event so /despertar page can show glitched name
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('haita-identity-glitch', { detail: { name: eloName } }));
    }, 1500);
  }, [pathname]);

  return null;
}

// ─── Main HaitaPresence ───────────────────────────────────────────────────────

interface HaitaPresenceProps {
  corruptionLevel: number;
  wrongAnswerCount: number;
}

export default function HaitaPresence({ corruptionLevel, wrongAnswerCount }: HaitaPresenceProps) {
  const { fullHorror } = useHorror();
  const { active: audioActive } = useAudio();

  if (!fullHorror) return null;

  return (
    <>
      <TheEye />
      <GhostText triggerCount={wrongAnswerCount} />
      <PossessedCursor corruptionLevel={corruptionLevel} />
      <ScrollReflex audioActive={audioActive} />
      <ScreenshotDetector />
      <IdentityGlitch />
    </>
  );
}
