import { COLS, ROWS, CELLS, seqLength, movesLimitFor } from '../constants/config';

/** Deterministic PRNG so a given level always looks identical (stable LevelMap). */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function (): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const idx = (r: number, c: number) => r * COLS + c;
const rowOf = (i: number) => Math.floor(i / COLS);
const colOf = (i: number) => i % COLS;

/** Orthogonal adjacency of two flat cell indices. */
export function isAdjacent(a: number, b: number): boolean {
  const dr = Math.abs(rowOf(a) - rowOf(b));
  const dc = Math.abs(colOf(a) - colOf(b));
  return dr + dc === 1;
}

function neighbors(i: number): number[] {
  const r = rowOf(i);
  const c = colOf(i);
  const out: number[] = [];
  if (r > 0) out.push(idx(r - 1, c));
  if (r < ROWS - 1) out.push(idx(r + 1, c));
  if (c > 0) out.push(idx(r, c - 1));
  if (c < COLS - 1) out.push(idx(r, c + 1));
  return out;
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** One self-avoiding random walk of the requested length, or null if it stalls. */
function tryWalk(len: number, rng: () => number): number[] | null {
  const start = Math.floor(rng() * CELLS);
  const path = [start];
  const used = new Set<number>([start]);
  while (path.length < len) {
    const cur = path[path.length - 1];
    const options = shuffle(
      neighbors(cur).filter((n) => !used.has(n)),
      rng,
    );
    if (options.length === 0) return null;
    const next = options[0];
    path.push(next);
    used.add(next);
  }
  return path;
}

/** Guaranteed boustrophedon (snake) path — always length CELLS. */
function snakePath(): number[] {
  const path: number[] = [];
  for (let r = 0; r < ROWS; r++) {
    if (r % 2 === 0) {
      for (let c = 0; c < COLS; c++) path.push(idx(r, c));
    } else {
      for (let c = COLS - 1; c >= 0; c--) path.push(idx(r, c));
    }
  }
  return path;
}

export interface Level {
  index: number;
  n: number; // sequence length 1..n
  cells: number[]; // length CELLS: 0 = water/empty, else the number on that tile
  order: number[]; // order[k] = flat cell index holding number k+1 (length n)
  movesLimit: number;
}

export function generateLevel(index: number): Level {
  const n = seqLength(index);
  const rng = mulberry32((index + 1) * 2654435761);

  let walk: number[] | null = null;
  for (let attempt = 0; attempt < 80 && !walk; attempt++) {
    walk = tryWalk(n, rng);
  }
  if (!walk) {
    // fallback: deterministic snake, take first n cells (always adjacent chain)
    walk = snakePath().slice(0, n);
  }

  const cells = new Array<number>(CELLS).fill(0);
  const order = new Array<number>(n);
  for (let k = 0; k < n; k++) {
    cells[walk[k]] = k + 1;
    order[k] = walk[k];
  }

  return { index, n, cells, order, movesLimit: movesLimitFor(n) };
}
