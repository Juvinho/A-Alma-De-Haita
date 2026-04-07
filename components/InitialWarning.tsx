'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHorror } from '@/contexts/HorrorContext';

export default function InitialWarning() {
  const { mode, setMode } = useHorror();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show if user hasn't chosen yet
    if (mode === 'unset') {
      // Small delay to let the page settle
      const t = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(t);
    }
  }, [mode]);

  function choose(m: 'full' | 'reduced') {
    setMode(m);
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[200] flex items-center justify-center px-6"
          style={{ background: 'rgba(5, 5, 5, 0.96)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-sm w-full border border-[var(--accent-blood)] bg-[#080404] p-8 relative"
            style={{ boxShadow: '0 0 60px #8b000022' }}
          >
            {/* Corner marks */}
            <span className="absolute top-2 left-2 text-[0.5rem] text-[var(--accent-blood)] opacity-60">✦</span>
            <span className="absolute bottom-2 right-2 text-[0.5rem] text-[var(--accent-blood)] opacity-60">✦</span>

            {/* Symbol */}
            <div className="text-center text-2xl text-[var(--accent-crimson)] opacity-50 mb-5 select-none">
              ✦
            </div>

            {/* Title */}
            <h2 className="font-display text-xs text-[var(--accent-gold)] uppercase tracking-widest text-center mb-5">
              Aviso
            </h2>

            {/* Text */}
            <p className="font-body text-[var(--text-secondary)] text-sm leading-relaxed mb-6 text-center">
              Este site contém elementos de{' '}
              <span className="text-[var(--text-primary)] italic">horror atmosférico</span>:
              sons procedurais, efeitos visuais inesperados e manipulação de interface.
            </p>
            <p className="font-mono text-xs text-[var(--text-secondary)] opacity-50 leading-relaxed mb-7 text-center">
              Não contém imagens perturbadoras, conteúdo violento ou flashes epiléticos.
              Recomendado: fones de ouvido e ambiente escuro.
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => choose('full')}
                className="w-full font-display text-xs tracking-widest uppercase py-3 px-6 border border-[var(--accent-crimson)] text-[var(--accent-crimson)] hover:bg-[var(--accent-blood)] hover:text-[var(--text-primary)] transition-all duration-200"
              >
                [ Entrar ]
              </button>
              <button
                onClick={() => choose('reduced')}
                className="w-full font-mono text-xs tracking-widest py-2 text-[var(--text-secondary)] opacity-40 hover:opacity-70 transition-opacity"
              >
                entrar sem efeitos de horror
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
