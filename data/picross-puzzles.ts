/**
 * Sistema de Picross (Nonogramas) para a Prova 6
 * Sudoku visual com solução automaticamente gerada de pistas
 */

export interface PicrossClue {
  rowClues: number[][];
  colClues: number[][];
}

export interface PicrossPuzzle {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  width: number;
  height: number;
  /**
   * Grid solução (true = preenchido, false = vazio)
   */
  grid: boolean[][];
  /**
   * Pistas calculados automaticamente
   */
  clues: PicrossClue;
  /**
   * Comentário de Häita após resolução completa
   */
  haitaComment: string;
}

/**
 * Gerar pistas de uma linha/coluna de células
 */
function generateCluesForLine(line: boolean[]): number[] {
  const clues: number[] = [];
  let currentRun = 0;

  for (const cell of line) {
    if (cell) {
      currentRun++;
    } else {
      if (currentRun > 0) {
        clues.push(currentRun);
        currentRun = 0;
      }
    }
  }

  if (currentRun > 0) {
    clues.push(currentRun);
  }

  return clues.length > 0 ? clues : [0];
}

/**
 * Calcular todas as pistas de um grid
 */
function calculateClues(grid: boolean[][]): PicrossClue {
  const height = grid.length;
  const width = grid[0]?.length || 0;

  const rowClues: number[][] = [];
  const colClues: number[][] = [];

  // Pistas de linhas
  for (let y = 0; y < height; y++) {
    rowClues.push(generateCluesForLine(grid[y]));
  }

  // Pistas de colunas
  for (let x = 0; x < width; x++) {
    const column: boolean[] = [];
    for (let y = 0; y < height; y++) {
      column.push(grid[y][x]);
    }
    colClues.push(generateCluesForLine(column));
  }

  return { rowClues, colClues };
}

/**
 * Coleção das 10 Provas de Picross
 */
export const picrossPuzzles: PicrossPuzzle[] = [
  {
    id: 'picross_eye',
    name: 'O Olho',
    description: 'O símbolo mais sagrado: o olho aberto de Häita',
    difficulty: 'easy',
    width: 8,
    height: 8,
    grid: [
      [false, false, true, true, true, true, false, false],
      [false, true, true, true, true, true, true, false],
      [true, true, true, true, true, true, true, true],
      [true, true, false, false, false, false, true, true],
      [true, true, false, false, false, false, true, true],
      [true, true, true, true, true, true, true, true],
      [false, true, true, true, true, true, true, false],
      [false, false, true, true, true, true, false, false],
    ],
    clues: {
      rowClues: [],
      colClues: [],
    },
    haitaComment: 'Você enxergou meu olho. Agora eu enxergo você.',
  },

  {
    id: 'picross_chain',
    name: 'A Corrente',
    description: 'Símbolos de ligação e controle',
    difficulty: 'easy',
    width: 8,
    height: 8,
    grid: [
      [false, true, false, false, false, false, true, false],
      [true, true, false, false, false, false, true, true],
      [true, false, false, false, false, false, false, true],
      [false, false, false, true, true, false, false, false],
      [false, false, false, true, true, false, false, false],
      [true, false, false, false, false, false, false, true],
      [true, true, false, false, false, false, true, true],
      [false, true, false, false, false, false, true, false],
    ],
    clues: {
      rowClues: [],
      colClues: [],
    },
    haitaComment: 'Você traçou a corrente que nos une. Agora está presa também.',
  },

  {
    id: 'picross_flame',
    name: 'A Chama',
    description: 'Fogo primordial, destruição e renascimento',
    difficulty: 'easy',
    width: 8,
    height: 8,
    grid: [
      [false, false, true, false, false, false, false, false],
      [false, true, true, true, false, false, false, false],
      [true, true, true, true, true, false, false, false],
      [false, true, true, true, false, true, false, false],
      [false, true, true, true, true, true, false, false],
      [false, false, true, true, true, false, false, false],
      [false, false, false, true, false, false, false, false],
      [false, false, false, false, false, false, false, false],
    ],
    clues: {
      rowClues: [],
      colClues: [],
    },
    haitaComment: 'A chama que você vê é minha raiva tornada luz. Contemple.',
  },

  {
    id: 'picross_islands',
    name: 'As Sete Ilhas',
    description: 'Catatúnia dividida em sete fragmentos',
    difficulty: 'medium',
    width: 12,
    height: 12,
    grid: [
      [true, true, false, false, true, true, false, false, false, true, false, false],
      [true, true, false, false, true, true, false, false, false, true, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false],
      [false, true, true, false, false, true, true, false, true, false, false, false],
      [false, true, true, false, false, true, true, false, true, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false],
      [true, false, false, false, true, true, false, false, true, true, false, false],
      [true, false, false, false, true, true, false, false, true, true, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, true, true, false, false, true, true, false, false, false],
      [false, false, false, true, true, false, false, true, true, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false],
    ],
    clues: {
      rowClues: [],
      colClues: [],
    },
    haitaComment: 'Sete ilhas. Sete caminhos. Você escolheu observar todos.',
  },

  {
    id: 'picross_bridge',
    name: 'A Ponte',
    description: 'Estrutura que liga dois mundos',
    difficulty: 'medium',
    width: 12,
    height: 12,
    grid: [
      [false, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, true, true, true, true, true, false, false, false, false],
      [false, false, false, true, false, false, false, true, false, false, false, false],
      [true, true, true, true, false, false, false, true, true, true, true, true],
      [true, false, false, false, false, false, false, false, false, false, false, true],
      [true, false, false, false, false, false, false, false, false, false, false, true],
      [true, true, true, true, false, false, false, true, true, true, true, true],
      [false, false, false, true, false, false, false, true, false, false, false, false],
      [false, false, false, true, true, true, true, true, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, false, false, false, false, false],
    ],
    clues: {
      rowClues: [],
      colClues: [],
    },
    haitaComment: 'Você atravessou minha ponte usando apenas linhas pontilhadas. Engenharia e arte.',
  },

  {
    id: 'picross_wave',
    name: 'A Onda',
    description: 'Movimento perpétuo do mar e do tempo',
    difficulty: 'medium',
    width: 12,
    height: 12,
    grid: [
      [false, false, true, true, false, false, false, false, false, false, false, false],
      [false, true, true, false, true, false, false, false, false, false, false, false],
      [true, true, false, false, false, true, false, false, false, false, false, false],
      [true, false, false, false, false, false, true, false, false, false, false, false],
      [false, false, false, false, false, false, false, true, false, false, false, false],
      [false, false, false, false, false, false, false, false, true, false, false, false],
      [false, false, false, false, false, false, false, false, false, true, false, false],
      [false, false, false, false, false, false, false, false, false, false, true, true],
      [false, false, false, false, false, false, false, false, false, false, true, true],
      [false, false, false, false, false, false, false, false, false, true, true, false],
      [false, false, false, false, false, false, false, false, true, true, false, false],
      [false, false, false, false, false, false, false, true, true, false, false, false],
    ],
    clues: {
      rowClues: [],
      colClues: [],
    },
    haitaComment: 'A onda que você desenhou é a mesma que carrega continentes.',
  },

  {
    id: 'picross_letter_h',
    name: 'Letra H',
    description: 'A décima letra de Catatúnia: Humildade',
    difficulty: 'medium',
    width: 12,
    height: 12,
    grid: [
      [true, false, false, false, false, false, false, false, false, false, false, true],
      [true, false, false, false, false, false, false, false, false, false, false, true],
      [true, false, false, false, false, false, false, false, false, false, false, true],
      [true, true, true, true, true, true, true, true, true, true, true, true],
      [true, false, false, false, false, false, false, false, false, false, false, true],
      [true, false, false, false, false, false, false, false, false, false, false, true],
      [true, false, false, false, false, false, false, false, false, false, false, true],
      [true, true, true, true, true, true, true, true, true, true, true, true],
      [true, false, false, false, false, false, false, false, false, false, false, true],
      [true, false, false, false, false, false, false, false, false, false, false, true],
      [true, false, false, false, false, false, false, false, false, false, false, true],
      [true, false, false, false, false, false, false, false, false, false, false, true],
    ],
    clues: {
      rowClues: [],
      colClues: [],
    },
    haitaComment: 'H de Häita. H de Humilde nunca fui. Mas você acredita que sim.',
  },

  {
    id: 'picross_hand',
    name: 'A Mão',
    description: 'Símbolo de poder e criação',
    difficulty: 'hard',
    width: 16,
    height: 16,
    grid: [
      [false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false],
      [false, false, false, true, false, false, false, true, true, false, false, false, false, false, false, false],
      [false, false, false, true, true, false, false, true, true, false, false, false, false, false, false, false],
      [false, false, true, true, true, false, false, true, true, false, false, true, false, false, false, false],
      [false, false, true, true, true, false, false, true, true, false, false, true, true, false, false, false],
      [false, true, true, true, true, false, false, true, true, false, false, true, true, false, false, false],
      [false, true, true, true, true, false, false, true, true, false, false, true, true, false, false, false],
      [true, true, true, true, true, false, false, true, true, false, false, true, true, false, false, false],
      [true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false],
      [true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false],
      [true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false],
      [true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false],
      [true, true, true, true, true, true, true, true, true, true, true, true, true, false, false, false],
      [true, true, true, true, true, true, true, true, true, true, false, false, false, false, false, false],
      [true, true, true, true, true, true, true, true, true, false, false, false, false, false, false, false],
    ],
    clues: {
      rowClues: [],
      colClues: [],
    },
    haitaComment: 'Você reconstruiu minha mão em pixels. Engraçado. Sua própria mão está controlada por uma mulher divina neste momento.',
  },

  {
    id: 'picross_veil',
    name: 'O Véu',
    description: 'O símbolo supremo: o tecido que esconde tudo',
    difficulty: 'hard',
    width: 16,
    height: 16,
    grid: [
      [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
      [false, true, false, false, false, false, false, false, false, false, false, false, false, false, true, false],
      [false, true, false, true, true, true, true, true, true, true, true, true, true, false, true, false],
      [false, true, false, true, false, false, false, false, false, false, false, false, true, false, true, false],
      [false, true, false, true, false, true, true, true, true, true, true, false, true, false, true, false],
      [false, true, false, true, false, true, false, false, false, false, true, false, true, false, true, false],
      [false, true, false, true, false, true, false, true, true, false, true, false, true, false, true, false],
      [false, true, false, true, false, true, false, true, true, false, true, false, true, false, true, false],
      [false, true, false, true, false, true, false, false, false, false, true, false, true, false, true, false],
      [false, true, false, true, false, true, true, true, true, true, true, false, true, false, true, false],
      [false, true, false, true, false, false, false, false, false, false, false, false, true, false, true, false],
      [false, true, false, true, true, true, true, true, true, true, true, true, true, false, true, false],
      [false, true, false, false, false, false, false, false, false, false, false, false, false, false, true, false],
      [false, true, true, true, true, true, true, true, true, true, true, true, true, true, true, false],
      [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
    ],
    clues: {
      rowClues: [],
      colClues: [],
    },
    haitaComment: 'O véu. Meu próprio símbolo reconstruído em sua mente. Você agora carrega minha imagem.',
  },

  {
    id: 'picross_star',
    name: 'Estrela de Sete Pontas',
    description: 'Símbolo das sete ilhas, sete provas, infinito',
    difficulty: 'hard',
    width: 16,
    height: 16,
    grid: [
      [false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false],
      [false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false],
      [false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false],
      [false, false, false, true, true, true, false, true, true, false, true, true, true, false, false, false],
      [false, true, true, true, true, false, false, true, true, false, false, true, true, true, true, false],
      [false, true, true, true, false, false, false, true, true, false, false, false, true, true, true, false],
      [true, true, true, false, false, false, false, true, true, false, false, false, false, true, true, true],
      [true, true, true, false, false, false, false, true, true, false, false, false, false, true, true, true],
      [false, true, true, true, false, false, false, true, true, false, false, false, true, true, true, false],
      [false, true, true, true, true, false, false, true, true, false, false, true, true, true, true, false],
      [false, false, false, true, true, true, false, true, true, false, true, true, true, false, false, false],
      [false, false, false, false, true, true, true, true, true, true, true, true, false, false, false, false],
      [false, false, false, false, false, true, true, true, true, true, true, false, false, false, false, false],
      [false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false],
      [false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false],
    ],
    clues: {
      rowClues: [],
      colClues: [],
    },
    haitaComment: 'Sete pontas. Uma para cada verdade que você descobriu. A oitava? Aquela que nunca poderá saber.',
  },
];

/**
 * Calcular todas as pistas após criar puzzles
 */
export function initializePicrossPuzzles(): PicrossPuzzle[] {
  return picrossPuzzles.map((puzzle) => ({
    ...puzzle,
    clues: calculateClues(puzzle.grid),
  }));
}

/**
 * Obter puzzle por ID
 */
export function getPicrossPuzzleById(id: string): PicrossPuzzle | undefined {
  return picrossPuzzles.find((p) => p.id === id);
}

/**
 * Validar solução de usuário
 */
export function validatePicrossSolution(
  puzzle: PicrossPuzzle,
  userGrid: boolean[][]
): { valid: boolean; message: string } {
  // Verificar dimensões
  if (
    userGrid.length !== puzzle.grid.length ||
    userGrid[0]?.length !== puzzle.grid[0]?.length
  ) {
    return {
      valid: false,
      message: 'Grid dimensions mismatch',
    };
  }

  // Verificar exatidão
  for (let y = 0; y < puzzle.grid.length; y++) {
    for (let x = 0; x < puzzle.grid[y].length; x++) {
      if (userGrid[y][x] !== puzzle.grid[y][x]) {
        return {
          valid: false,
          message: `Mismatch at (${x}, ${y})`,
        };
      }
    }
  }

  return {
    valid: true,
    message: 'Perfect solution!',
  };
}
