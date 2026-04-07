/**
 * Maze Generator — Recursive Backtracking + BFS pathfinding.
 * Used by Prova 1 (O Labirinto dos Véus).
 */

export interface MazeCell {
  x: number;
  y: number;
  walls: [boolean, boolean, boolean, boolean]; // [top, right, bottom, left]
  visited: boolean;
}

export interface MazeData {
  width: number;
  height: number;
  cells: MazeCell[][];
  solution: { x: number; y: number }[];
}

// ─── Seeded RNG (mulberry32) ──────────────────────────────────────────────────

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleArray<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Grid helpers ─────────────────────────────────────────────────────────────

const DIRS = [
  { dx: 0, dy: -1, wall: 0, opposite: 2 }, // top
  { dx: 1, dy: 0,  wall: 1, opposite: 3 }, // right
  { dx: 0, dy: 1,  wall: 2, opposite: 0 }, // bottom
  { dx: -1, dy: 0, wall: 3, opposite: 1 }, // left
];

function makeGrid(w: number, h: number): MazeCell[][] {
  return Array.from({ length: h }, (_, y) =>
    Array.from({ length: w }, (_, x) => ({
      x,
      y,
      walls: [true, true, true, true] as [boolean, boolean, boolean, boolean],
      visited: false,
    }))
  );
}

function inBounds(x: number, y: number, w: number, h: number) {
  return x >= 0 && y >= 0 && x < w && y < h;
}

// ─── Recursive Backtracking ───────────────────────────────────────────────────

function carve(
  cells: MazeCell[][],
  x: number,
  y: number,
  w: number,
  h: number,
  rand: () => number
) {
  cells[y][x].visited = true;
  const dirs = shuffleArray(DIRS, rand);
  for (const d of dirs) {
    const nx = x + d.dx;
    const ny = y + d.dy;
    if (inBounds(nx, ny, w, h) && !cells[ny][nx].visited) {
      cells[y][x].walls[d.wall] = false;
      cells[ny][nx].walls[d.opposite] = false;
      carve(cells, nx, ny, w, h, rand);
    }
  }
}

// ─── BFS shortest path ────────────────────────────────────────────────────────

export function bfsSolve(
  cells: MazeCell[][],
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  w: number,
  h: number
): { x: number; y: number }[] | null {
  const queue: { x: number; y: number; path: { x: number; y: number }[] }[] = [
    { x: startX, y: startY, path: [{ x: startX, y: startY }] },
  ];
  const visited = new Set<string>();
  visited.add(`${startX},${startY}`);

  while (queue.length > 0) {
    const { x, y, path } = queue.shift()!;
    if (x === endX && y === endY) return path;

    for (const d of DIRS) {
      const nx = x + d.dx;
      const ny = y + d.dy;
      const key = `${nx},${ny}`;
      if (
        inBounds(nx, ny, w, h) &&
        !visited.has(key) &&
        !cells[y][x].walls[d.wall]
      ) {
        visited.add(key);
        queue.push({ x: nx, y: ny, path: [...path, { x: nx, y: ny }] });
      }
    }
  }
  return null;
}

// ─── Generate ─────────────────────────────────────────────────────────────────

export function generateMaze(
  width: number,
  height: number,
  seed?: number
): MazeData {
  const rand = mulberry32(seed ?? Date.now());
  const cells = makeGrid(width, height);
  carve(cells, 0, 0, width, height, rand);

  // Reset visited flag for gameplay use
  cells.forEach((row) => row.forEach((c) => (c.visited = false)));

  const solution = bfsSolve(cells, 0, 0, width - 1, height - 1, width, height)!;

  return { width, height, cells, solution };
}

// ─── Mutate (pulse) ───────────────────────────────────────────────────────────
// Randomly flip ~percent% of interior walls, ensuring solution remains valid.

export function mutateMaze(maze: MazeData, percent = 0.15, seed?: number): MazeData {
  const { width, height } = maze;
  const rand = mulberry32(seed ?? Date.now());

  // Deep clone cells
  const cells: MazeCell[][] = maze.cells.map((row) =>
    row.map((c) => ({ ...c, walls: [...c.walls] as [boolean, boolean, boolean, boolean] }))
  );

  // Collect mutable wall segments (avoid outer border)
  type WallSeg = { x: number; y: number; dir: number; opp: number; nx: number; ny: number };
  const segments: WallSeg[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Right wall (dir=1) and bottom wall (dir=2) — avoids duplicates
      for (const dir of [1, 2]) {
        const d = DIRS[dir];
        const nx = x + d.dx;
        const ny = y + d.dy;
        if (inBounds(nx, ny, width, height)) {
          segments.push({ x, y, dir, opp: d.opposite, nx, ny });
        }
      }
    }
  }

  // Shuffle and flip percent of them
  const count = Math.floor(segments.length * percent);
  const chosen = shuffleArray(segments, rand).slice(0, count);

  for (const seg of chosen) {
    const current = cells[seg.y][seg.x].walls[seg.dir];
    cells[seg.y][seg.x].walls[seg.dir] = !current;
    cells[seg.ny][seg.nx].walls[seg.opp] = !current;
  }

  // Verify solvability — revert changes if broken
  const newSolution = bfsSolve(cells, 0, 0, width - 1, height - 1, width, height);
  if (!newSolution) {
    // Revert: restore original maze
    return { ...maze, cells: maze.cells };
  }

  return { width, height, cells, solution: newSolution };
}

// ─── Changed cells between two maze states ────────────────────────────────────

export function getChangedWalls(
  old: MazeData,
  next: MazeData
): { x: number; y: number }[] {
  const changed: { x: number; y: number }[] = [];
  for (let y = 0; y < old.height; y++) {
    for (let x = 0; x < old.width; x++) {
      for (let d = 0; d < 4; d++) {
        if (old.cells[y][x].walls[d] !== next.cells[y][x].walls[d]) {
          changed.push({ x, y });
          break;
        }
      }
    }
  }
  return changed;
}
