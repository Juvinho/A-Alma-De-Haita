'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useVNStore } from '@/stores/vn-store';
import { useRouter } from 'next/navigation';
import type { EndingId } from '@/types/vn';

const endingData: Record<EndingId, { title: string; subtitle: string; color: string }> = {
  rachadas: {
    title: 'Rachadas',
    subtitle: 'Três meninas rachadas. Segurando os pedaços umas das outras.',
    color: '#c9a84c',
  },
  'sem-deusa': {
    title: 'Sem Deusa',
    subtitle: 'Häita pode ter escolhido elas. Mas elas escolheram umas às outras. E isso é mais.',
    color: '#8a7a4c',
  },
  assistindo: {
    title: 'Assistindo',
    subtitle: 'Eu vejo tudo. Sempre vi.',
    color: '#6a4a8a',
  },
};

export function VNEndingScreen() {
  const isEnded = useVNStore((s) => s.isEnded);
  const currentEnding = useVNStore((s) => s.currentEnding);
  const router = useRouter();

  const data = currentEnding ? endingData[currentEnding] : null;

  return (
    <AnimatePresence>
      {isEnded && data && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          style={{ background: 'rgba(5,0,0,0.97)' }}
        >
          {/* Decorative horizontal line */}
          <motion.div
            className="w-24 h-px mb-8"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            style={{ background: 'var(--vn-border-gold)', transformOrigin: 'left' }}
          />

          <motion.h1
            className="font-cinzel text-4xl uppercase tracking-[0.4em] mb-4 text-center px-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            style={{ color: data.color }}
          >
            {data.title}
          </motion.h1>

          <motion.p
            className="font-cormorant italic text-xl text-center px-12 max-w-lg leading-relaxed mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3 }}
            style={{ color: 'var(--vn-text-cream)' }}
          >
            {data.subtitle}
          </motion.p>

          <motion.div
            className="w-24 h-px mb-16"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 4 }}
            style={{ background: 'var(--vn-border-gold)', transformOrigin: 'right' }}
          />

          {/* Buttons */}
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 4.5 }}
          >
            <button
              className="font-cinzel text-xs uppercase tracking-widest px-5 py-2.5 transition-all hover:opacity-100 opacity-80"
              style={{
                background: 'rgba(42,5,5,0.8)',
                border: '1px solid var(--vn-border-gold)',
                color: 'var(--vn-text-gold)',
                clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
              }}
              onClick={() => {
                useVNStore.getState().startGame();
              }}
            >
              Jogar Novamente
            </button>
            <button
              className="font-cinzel text-xs uppercase tracking-widest px-5 py-2.5 transition-all hover:opacity-100 opacity-70"
              style={{
                background: 'rgba(15,5,5,0.8)',
                border: '1px solid var(--vn-border-gold-dim)',
                color: 'var(--vn-text-cream)',
                clipPath: 'polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)',
              }}
              onClick={() => router.push('/servas')}
            >
              Tela de Título
            </button>
          </motion.div>

          {/* Credits */}
          <motion.p
            className="absolute bottom-6 font-cinzel text-xs uppercase tracking-[0.3em] opacity-30"
            style={{ color: 'var(--vn-text-cream)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1, delay: 5 }}
          >
            Fundação Varguelia — JuvinhoDev
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
