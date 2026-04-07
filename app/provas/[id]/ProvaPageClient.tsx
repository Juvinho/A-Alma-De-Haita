'use client';

import { useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProgress } from '@/hooks/useProgress';
import { useProvaProgress } from '@/hooks/useProvaProgress';
import { isProvaUnlocked } from '@/data/provas-meta';
import Labirinto from '@/components/provas/games/Labirinto';
import EcosEscuridao from '@/components/provas/games/EcosEscuridao';
import TravessiaPonte from '@/components/provas/games/TravessiaPonte';
import TearHaita from '@/components/provas/games/TearHaita';
import CacaSombras from '@/components/provas/games/CacaSombras';
import CifraViva from '@/components/provas/games/CifraViva';
import EscolhaMaya from '@/components/provas/games/EscolhaMaya';
import Espelho from '@/components/provas/games/Espelho';

interface Props {
  id: string;
}

const GAMES: Record<string, React.ComponentType<{ onComplete?: () => void }>> = {
  p1: Labirinto,
  p2: EcosEscuridao,
  p3: TravessiaPonte,
  p4: TearHaita,
  p5: CacaSombras,
  p6: CifraViva,
  p7: EscolhaMaya,
  p8: Espelho,
};

export default function ProvaPageClient({ id }: Props) {
  const router = useRouter();
  const { progress, loaded } = useProgress();
  const { all } = useProvaProgress();

  const Game = useMemo(() => GAMES[id], [id]);

  const completedProvas = useMemo(
    () =>
      Object.entries(all)
        .filter(([, p]) => p.completed)
        .map(([pid]) => pid),
    [all]
  );

  useEffect(() => {
    if (!loaded) return;

    if (!progress.eloName) {
      router.replace('/despertar');
      return;
    }

    const provasUnlockedByEnigmas = progress.completedEnigmas.length >= 6;
    if (!provasUnlockedByEnigmas) {
      router.replace('/veus');
      return;
    }

    if (!Game) {
      router.replace('/provas');
      return;
    }

    if (!isProvaUnlocked(id, completedProvas)) {
      router.replace('/provas');
    }
  }, [loaded, progress.eloName, progress.completedEnigmas.length, Game, id, completedProvas, router]);

  if (!loaded || !progress.eloName || !Game) {
    return null;
  }

  return <Game />;
}
