export interface SpriteConfig {
  name: string;
  displayName: string;
  nameColor: string;
  nameBgColor: string;
  poses: Record<string, string>;
}

// ── Mapeamento de nomes semânticos → arquivos de sprite ──
// pose-01 a pose-16 para maya e ella, pose-01 a pose-07 para marci

export const characters: Record<string, SpriteConfig> = {
  maya: {
    name: 'maya',
    displayName: 'Maya',
    nameColor: '#c9a84c',
    nameBgColor: '#3a0a0a',
    poses: {
      neutral:       '/assets/vn/sprites/maya/pose-01.png',
      serious:       '/assets/vn/sprites/maya/pose-02.png',
      sad:           '/assets/vn/sprites/maya/pose-03.png',
      'looking-away':'/assets/vn/sprites/maya/pose-04.png',
      surprised:     '/assets/vn/sprites/maya/pose-05.png',
      scared:        '/assets/vn/sprites/maya/pose-06.png',
      determined:    '/assets/vn/sprites/maya/pose-07.png',
      rigid:         '/assets/vn/sprites/maya/pose-08.png',
      angry:         '/assets/vn/sprites/maya/pose-09.png',
      reading:       '/assets/vn/sprites/maya/pose-10.png',
      'smiling-soft':'/assets/vn/sprites/maya/pose-11.png',
      thinking:      '/assets/vn/sprites/maya/pose-12.png',
      confident:     '/assets/vn/sprites/maya/pose-13.png',
      worried:       '/assets/vn/sprites/maya/pose-14.png',
      speaking:      '/assets/vn/sprites/maya/pose-15.png',
      shocked:       '/assets/vn/sprites/maya/pose-16.png',
    },
  },

  ella: {
    name: 'ella',
    displayName: 'Ella',
    nameColor: '#c9a84c',
    nameBgColor: '#3a0a1a',
    poses: {
      neutral:       '/assets/vn/sprites/ella/pose-01.png',
      sad:           '/assets/vn/sprites/ella/pose-02.png',
      'looking-away':'/assets/vn/sprites/ella/pose-03.png',
      surprised:     '/assets/vn/sprites/ella/pose-04.png',
      thinking:      '/assets/vn/sprites/ella/pose-05.png',
      confident:     '/assets/vn/sprites/ella/pose-06.png',
      angry:         '/assets/vn/sprites/ella/pose-07.png',
      curious:       '/assets/vn/sprites/ella/pose-08.png',
      determined:    '/assets/vn/sprites/ella/pose-09.png',
      happy:         '/assets/vn/sprites/ella/pose-10.png',
      scared:        '/assets/vn/sprites/ella/pose-11.png',
      serious:       '/assets/vn/sprites/ella/pose-12.png',
      shocked:       '/assets/vn/sprites/ella/pose-13.png',
      worried:       '/assets/vn/sprites/ella/pose-14.png',
      speaking:      '/assets/vn/sprites/ella/pose-15.png',
      'smiling-soft':'/assets/vn/sprites/ella/pose-16.png',
    },
  },

  marci: {
    name: 'marci',
    displayName: 'Marci',
    nameColor: '#c9a84c',
    nameBgColor: '#0a0a2a',
    poses: {
      neutral:        '/assets/vn/sprites/marci/pose-01.png',
      'smiling-soft': '/assets/vn/sprites/marci/pose-02.png',
      speaking:       '/assets/vn/sprites/marci/pose-03.png',
      thinking:       '/assets/vn/sprites/marci/pose-04.png',
      sad:            '/assets/vn/sprites/marci/pose-05.png',
      'arms-crossed': '/assets/vn/sprites/marci/pose-06.png',
      scared:         '/assets/vn/sprites/marci/pose-07.png',
      // aliases para poses que não existem individualmente
      serious:        '/assets/vn/sprites/marci/pose-06.png',
      surprised:      '/assets/vn/sprites/marci/pose-04.png',
      worried:        '/assets/vn/sprites/marci/pose-05.png',
      curious:        '/assets/vn/sprites/marci/pose-02.png',
      happy:          '/assets/vn/sprites/marci/pose-02.png',
      confident:      '/assets/vn/sprites/marci/pose-03.png',
      angry:          '/assets/vn/sprites/marci/pose-06.png',
      shocked:        '/assets/vn/sprites/marci/pose-07.png',
      determined:     '/assets/vn/sprites/marci/pose-03.png',
    },
  },
};

/** Retorna o path do sprite dado personagem e pose. Fallback para neutral. */
export function getSpritePath(char: string, pose: string): string {
  const cfg = characters[char];
  if (!cfg) return '/assets/vn/sprites/maya/pose-01.png';
  return cfg.poses[pose] ?? cfg.poses['neutral'] ?? Object.values(cfg.poses)[0];
}

export type CharacterId = keyof typeof characters;
export type PoseId = string;
