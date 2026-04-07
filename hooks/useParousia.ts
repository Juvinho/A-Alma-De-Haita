'use client';

import { useEffect, useState, useCallback } from 'react';

export interface ParousiaOverrides {
  landingPhrase: string;
  hubGreeting: (nome: string) => string;
  enterButton: string;
  whisperPool: string[];
}

export interface UseParousiaReturn {
  isAscended: boolean;
  overrides: ParousiaOverrides | null;
  ascend: () => void;
}

export const parousiaOverrides: ParousiaOverrides = {
  landingPhrase: 'Você voltou. Eu sabia que voltaria.',

  hubGreeting: (nome: string) =>
    `${nome}. Os véus já não te escondem nada. Mas volte quando quiser. Até deusas apreciam companhia.`,

  enterButton: 'ENTRAR NOVAMENTE',

  whisperPool: [
    'Você ainda pensa em mim. Isso é mais do que a maioria faz.',
    'Os véus se lembram de você. Eu também.',
    'Não há mais enigmas. Mas ainda há mistério.',
    'Você provou algo. Não sei o quê. Mas provou.',
    'Da próxima vez que o crepúsculo manchar o céu de vermelho, saiba que é uma saudação.',
    'Mortal que volta é mortal que entendeu algo.',
    'Eu disse que minha paciência acabou. Com você, talvez eu estivesse errada.',
    'Não confunda minha calma com perdão. Confunda com curiosidade.',
  ],
};

export function useParousia(): UseParousiaReturn {
  const [isAscended, setIsAscended] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('haita-ascended') === 'true';
      setIsAscended(saved);

      if (saved) {
        document.documentElement.setAttribute('data-parousia', 'true');
      }
    }
  }, []);

  const ascend = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('haita-ascended', 'true');
      setIsAscended(true);
      document.documentElement.setAttribute('data-parousia', 'true');

      // Dispatch custom event for other components to react
      window.dispatchEvent(new CustomEvent('haita-parousia'));
    }
  }, []);

  if (!mounted) {
    return {
      isAscended: false,
      overrides: null,
      ascend,
    };
  }

  return {
    isAscended,
    overrides: isAscended ? parousiaOverrides : null,
    ascend,
  };
}