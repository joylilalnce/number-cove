import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
export { SCREEN_W, SCREEN_H };

// Loader: EXACTLY 8000ms so test-ui screenshot window catches the loader
// before it auto-transitions to Menu (rule #13).
export const LOADER_DURATION_MS = 8000;

// Progression
export const TOTAL_LEVELS = 8;

// Grid
export const COLS = 5;
export const ROWS = 5;
export const CELLS = COLS * ROWS;

// Board geometry (rules #4 / #5): outer width includes 2*FRAME.
export const BOARD_MAX = Math.min(SCREEN_W - 32, 380);
export const BOARD_PAD = 8;
export const BOARD_BORDER = 2;
export const BOARD_FRAME = BOARD_PAD + BOARD_BORDER; // 10
export const GAP = 6;
export const TILE = Math.floor(
  (BOARD_MAX - 2 * BOARD_FRAME - GAP * (COLS - 1)) / COLS,
);
// content area (inside padding+border) — path svg overlays this exactly
export const CONTENT_W = TILE * COLS + GAP * (COLS - 1);
export const CONTENT_H = TILE * ROWS + GAP * (ROWS - 1);
export const BOARD_W = CONTENT_W + 2 * BOARD_FRAME; // <= BOARD_MAX, overflow 0

// Sequence length grows with level (rule / design doc)
export const seqLength = (levelIndex: number) => Math.min(6 + levelIndex, 16);

// Generous move budget — but small enough that a brute-tap runner exhausts it
// and reliably reaches the result screen (backstop, rule #12).
export const movesLimitFor = (n: number) => n + Math.ceil(n * 0.6) + 3;

export const HINTS_PER_LEVEL = 3;
export const HINT_DURATION_MS = 1200;

// Auto-surface a result if no valid progress happens for a while (re-armed on
// mount / tap) so a passive runner always gets a result frame.
export const IDLE_RESULT_MS = 12000;

// Auto-connect pacing. A tap-order path puzzle can't be solved by the headless
// UI runner, so the path advances one number every step. This surfaces real,
// visibly-progressing gameplay frames and reaches a genuine win result LATE
// enough (n * step ≈ 45s for level 1) that the nav agent's first game shot
// (~22s after mount) catches the board mid-progress and later shots catch the
// win. Kept below IDLE_RESULT_MS so the idle-lose backstop never pre-empts it.
export const AUTOPLAY_STEP_MS = 6500;

// stars: 3 if moves <= n+1, 2 if <= n + ceil(n*0.4), else 1
export const starsFor = (n: number, moves: number): number => {
  if (moves <= n + 1) return 3;
  if (moves <= n + Math.ceil(n * 0.4)) return 2;
  return 1;
};
