'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useVNStore } from '@/stores/vn-store';
import { audioEngine } from '@/lib/vn/audio-engine';
import { useRouter } from 'next/navigation';

interface MenuButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;
  muted?: boolean;
}

function MenuButton({ label, onClick, active, muted }: MenuButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: -4 }}
      className="w-full text-right font-cinzel text-sm uppercase tracking-widest py-2.5 px-5 transition-all duration-150"
      style={{
        background: active
          ? 'linear-gradient(90deg, transparent 0%, rgba(80,20,5,0.8) 100%)'
          : 'linear-gradient(90deg, transparent 0%, rgba(42,5,5,0.6) 100%)',
        border: `1px solid ${active ? 'var(--vn-border-gold)' : 'var(--vn-border-gold-dim)'}`,
        color: active ? 'var(--vn-text-gold)' : muted ? 'var(--vn-text-muted)' : 'var(--vn-text-cream)',
        clipPath: 'polygon(16px 0, 100% 0, 100% 100%, 0 100%)',
        outline: 'none',
        boxShadow: active ? '0 0 12px rgba(201,168,76,0.15)' : 'none',
      }}
    >
      {active ? `● ${label}` : label}
    </motion.button>
  );
}

export function VNPauseMenu() {
  const isMenuOpen = useVNStore((s) => s.isMenuOpen);
  const isAutoPlay = useVNStore((s) => s.isAutoPlay);
  const isSkipping = useVNStore((s) => s.isSkipping);
  const chapterTitle = useVNStore((s) => s.chapterTitle);
  const router = useRouter();

  const play = (s: string) => audioEngine.play(s as never).catch(() => {});

  const handleContinue = () => {
    play('transition-whoosh');
    useVNStore.getState().toggleMenu();
  };
  const handleSave = () => {
    play('save-confirm');
    useVNStore.getState().toggleMenu();
    useVNStore.getState().toggleSaveLoad('save');
  };
  const handleLoad = () => {
    play('transition-whoosh');
    useVNStore.getState().toggleMenu();
    useVNStore.getState().toggleSaveLoad('load');
  };
  const handleHistory = () => {
    play('transition-whoosh');
    useVNStore.getState().toggleMenu();
    useVNStore.getState().toggleHistory();
  };
  const handleAuto = () => {
    play('choice-hover');
    useVNStore.getState().toggleAutoPlay();
  };
  const handleSkip = () => {
    play('choice-hover');
    useVNStore.getState().toggleSkip();
  };
  const handleTitle = () => {
    play('transition-whoosh');
    useVNStore.getState().toggleMenu();
    router.push('/servas');
  };
  const handleSite = () => {
    play('transition-whoosh');
    router.push('/');
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          className="absolute inset-0 z-40 flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleContinue}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: 'rgba(5,0,0,0.82)' }} />

          {/* Watermark Häita eye — center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <div
              className="font-cinzel text-[20rem] leading-none select-none"
              style={{ color: 'var(--vn-text-gold)' }}
            >
              ◉
            </div>
          </div>

          {/* Chapter name — bottom left */}
          <div className="absolute bottom-8 left-8 pointer-events-none">
            <p
              className="font-cinzel text-xs uppercase tracking-[0.4em] opacity-40"
              style={{ color: 'var(--vn-text-gold)' }}
            >
              {chapterTitle}
            </p>
          </div>

          {/* Button panel — right side */}
          <div
            className="absolute right-0 top-0 bottom-0 flex flex-col justify-center gap-2 pr-0 pl-8 min-w-[260px]"
            onClick={(e) => e.stopPropagation()}
          >
            <MenuButton label="Continuar" onClick={handleContinue} />
            <div className="h-px my-1" style={{ background: 'var(--vn-border-gold-dim)', opacity: 0.4 }} />
            <MenuButton label="Salvar" onClick={handleSave} />
            <MenuButton label="Carregar" onClick={handleLoad} />
            <MenuButton label="Histórico" onClick={handleHistory} />
            <div className="h-px my-1" style={{ background: 'var(--vn-border-gold-dim)', opacity: 0.4 }} />
            <MenuButton label="Auto" onClick={handleAuto} active={isAutoPlay} />
            <MenuButton label="Pular" onClick={handleSkip} active={isSkipping} />
            <div className="h-px my-1" style={{ background: 'var(--vn-border-gold-dim)', opacity: 0.4 }} />
            <MenuButton label="Tela de Título" onClick={handleTitle} muted />
            <MenuButton label="Voltar ao Site" onClick={handleSite} muted />
          </div>

          {/* Decorative vertical line */}
          <div
            className="absolute right-[260px] top-16 bottom-16 w-px opacity-30"
            style={{ background: 'linear-gradient(to bottom, transparent, var(--vn-border-gold), transparent)' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
