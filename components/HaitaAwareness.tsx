'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHorror } from '@/contexts/HorrorContext';
import { whispers } from '@/data/haita-whispers';

// ─── Tab Title Cycling ────────────────────────────────────────────────────────

const AWAY_TITLES = [
  'Os Véus de Häita',
  '...',
  'Eu sei que você está aí.',
  'Volte.',
  'Os Véus de Häita',
  'Você me deve atenção.',
  '...',
  'Häita espera.',
];

// ─── Console Messages ────────────────────────────────────────────────────────

const CONSOLE_MSGS = [
  () => console.log(
    '%cInspecionar elemento não vai te salvar de mim.',
    'color: #8b0000; font-size: 14px; font-family: serif; font-style: italic;'
  ),
  () => console.warn('AVISO: Entidade não-autorizada detectada no DOM.'),
  () => console.error('Erro: Tentativa de acesso ao plano astral negada. Motivo: mortal.'),
  () => console.log(
    '%cH Ä I T A',
    'color: #8b0000; font-size: 20px; font-weight: bold; font-family: serif; letter-spacing: 0.3em;'
  ),
  () => console.log(
    '%cVocê está lendo o código-fonte de uma deusa. Pense nisso.',
    'color: #8b0000; font-size: 11px; font-family: serif;'
  ),
  () => console.table([
    { propriedade: 'Nome', valor: 'Häita' },
    { propriedade: 'Status', valor: 'Furiosa' },
    { propriedade: 'Paciência', valor: '0%' },
    { propriedade: 'Localização', valor: 'Em todo lugar' },
    { propriedade: 'Você', valor: 'Observado' },
  ]),
  () => console.log(
    '%cse você está procurando bugs, o único bug aqui é a humanidade.',
    'color: #333; font-size: 9px; font-family: monospace;'
  ),
  () => console.log(
    '%cWihum aisën de\'u? Ei siehë de\'u.',
    'color: #c9b99a; font-size: 12px; font-style: italic; font-family: serif;'
  ),
  () => {
    console.groupCollapsed('▶ [REDACTED]');
    console.log('O pacto foi quebrado em ██/██/████. Os exilados estão voltando. Coordenadas: ██°██\'██"S ██°██\'██"L. Não procure.');
    console.groupEnd();
  },
];

// Detect DevTools open (approximate)
function isDevToolsOpen(): boolean {
  const threshold = 160;
  return (
    window.outerWidth - window.innerWidth > threshold ||
    window.outerHeight - window.innerHeight > threshold
  );
}

export default function HaitaAwareness() {
  const { fullHorror } = useHorror();
  const [returnMessage, setReturnMessage] = useState<string | null>(null);
  const absenceStart = useRef<number | null>(null);
  const titleCycleInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const titleIndex = useRef(0);
  const originalTitle = useRef('Os Véus de Häita');

  // ── Tab detection ──────────────────────────────────────────────────────────
  useEffect(() => {
    function onVisibilityChange() {
      if (document.hidden) {
        absenceStart.current = Date.now();

        // Cycle titles while away
        titleIndex.current = 0;
        titleCycleInterval.current = setInterval(() => {
          titleIndex.current = (titleIndex.current + 1) % AWAY_TITLES.length;
          document.title = AWAY_TITLES[titleIndex.current];
        }, 10_000);
      } else {
        // Returned
        if (titleCycleInterval.current) {
          clearInterval(titleCycleInterval.current);
          titleCycleInterval.current = null;
        }
        document.title = originalTitle.current;

        const absence = absenceStart.current ? Date.now() - absenceStart.current : 0;
        absenceStart.current = null;

        if (fullHorror) {
          if (absence > 300_000) {
            setReturnMessage(
              'Cinco minutos. Eu contei cada segundo. Você acha que pode me deixar esperando?'
            );
          } else if (absence > 120_000) {
            // Change title briefly
            document.title = 'Ela está esperando...';
            setTimeout(() => { document.title = originalTitle.current; }, 3000);
            setReturnMessage('Você voltou. Eu notei sua ausência.');
          } else if (absence > 30_000) {
            setReturnMessage('Você voltou. Eu notei sua ausência.');
          }
        }

        if (returnMessage) {
          setTimeout(() => setReturnMessage(null), 5000);
        }
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (titleCycleInterval.current) clearInterval(titleCycleInterval.current);
    };
  }, [fullHorror, returnMessage]);

  // Dismiss return message
  useEffect(() => {
    if (returnMessage) {
      const t = setTimeout(() => setReturnMessage(null), 5500);
      return () => clearTimeout(t);
    }
  }, [returnMessage]);

  // ── Console haunting ───────────────────────────────────────────────────────
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    let msgIndex = 0;

    function scheduleNext() {
      const delay = 60_000 + Math.random() * 120_000;
      timeout = setTimeout(() => {
        if (isDevToolsOpen()) {
          CONSOLE_MSGS[msgIndex % CONSOLE_MSGS.length]();
          msgIndex++;
        }
        scheduleNext();
      }, delay);
    }

    // Initial message after 30s
    const initial = setTimeout(() => {
      if (isDevToolsOpen()) {
        console.log(
          '%c--- OS VÉUS DE HÄITA ---\n\nSe você está aqui, é porque ousa.\nOu é curioso. Que é quase a mesma coisa.\n\nHäita está observando.\n\n---',
          'color: #8b0000; font-size: 13px; font-family: serif; line-height: 1.6;'
        );
      }
      scheduleNext();
    }, 30_000);

    return () => {
      clearTimeout(initial);
      clearTimeout(timeout);
    };
  }, []);

  // ── Konami code ────────────────────────────────────────────────────────────
  // (Handled in homepage + HorrorContext, see app/page.tsx)

  return (
    <>
      {/* Return message banner */}
      <AnimatePresence>
        {returnMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="fixed top-0 left-0 right-0 z-[170] flex items-center justify-center py-3 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(10,0,0,0.9) 0%, transparent 100%)' }}
          >
            <p className="font-body italic text-sm text-[var(--accent-crimson)] tracking-widest opacity-80 text-center px-8">
              {returnMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
