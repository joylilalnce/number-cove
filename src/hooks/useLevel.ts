import { useReducer, useEffect, useCallback, useMemo } from 'react';
import { generateLevel, Level } from '../game/levelGen';
import { HINTS_PER_LEVEL, HINT_DURATION_MS } from '../constants/config';

export type GameStatus = 'playing' | 'won' | 'lost';

interface State {
  level: Level;
  head: number; // count of connected numbers (0..n)
  movesUsed: number;
  hintsLeft: number;
  hintActive: boolean;
  shakeTick: number; // bumped on every invalid tap; drives the shake animation
}

type Action =
  | { type: 'TAP'; cell: number }
  | { type: 'UNDO' }
  | { type: 'RESTART' }
  | { type: 'HINT_ON' }
  | { type: 'HINT_OFF' }
  | { type: 'NEW'; index: number };

function statusOf(s: State): GameStatus {
  if (s.head >= s.level.n) return 'won';
  if (s.movesUsed >= s.level.movesLimit) return 'lost';
  return 'playing';
}

function fresh(index: number): State {
  return {
    level: generateLevel(index),
    head: 0,
    movesUsed: 0,
    hintsLeft: HINTS_PER_LEVEL,
    hintActive: false,
    shakeTick: 0,
  };
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'NEW':
      return fresh(a.index);
    case 'RESTART':
      return { ...fresh(s.level.index), level: s.level };
    case 'UNDO': {
      if (statusOf(s) !== 'playing' || s.head <= 0) return s;
      return {
        ...s,
        head: s.head - 1,
        movesUsed: Math.max(0, s.movesUsed - 1),
        hintActive: false,
      };
    }
    case 'HINT_ON': {
      if (statusOf(s) !== 'playing' || s.hintsLeft <= 0 || s.head >= s.level.n) {
        return s;
      }
      return { ...s, hintActive: true, hintsLeft: s.hintsLeft - 1 };
    }
    case 'HINT_OFF':
      return s.hintActive ? { ...s, hintActive: false } : s;
    case 'TAP': {
      if (statusOf(s) !== 'playing') return s;
      const need = s.head + 1;
      // By construction number `need` sits orthogonally adjacent to `head`,
      // so matching the value is a sufficient (and correct) validity check.
      if (s.level.cells[a.cell] === need) {
        return {
          ...s,
          head: s.head + 1,
          movesUsed: s.movesUsed + 1,
          hintActive: false,
        };
      }
      // invalid: wrong number / empty water / already connected; costs a move
      return {
        ...s,
        movesUsed: s.movesUsed + 1,
        shakeTick: s.shakeTick + 1,
        hintActive: false,
      };
    }
    default:
      return s;
  }
}

export function useLevel(levelIndex: number) {
  const [state, dispatch] = useReducer(reducer, levelIndex, fresh);

  // regenerate when the requested level changes
  useEffect(() => {
    dispatch({ type: 'NEW', index: levelIndex });
  }, [levelIndex]);

  // auto clear a hint highlight after its window
  useEffect(() => {
    if (!state.hintActive) return;
    const t = setTimeout(() => dispatch({ type: 'HINT_OFF' }), HINT_DURATION_MS);
    return () => clearTimeout(t);
  }, [state.hintActive]);

  const status = statusOf(state);

  const nextTargetIndex =
    state.head < state.level.n ? state.level.order[state.head] : -1;
  const nextTargetValue = state.head < state.level.n ? state.head + 1 : -1;

  // flat cell indices currently connected, in order (1..head)
  const pathCells = useMemo(
    () => state.level.order.slice(0, state.head),
    [state.level, state.head],
  );

  const tap = useCallback((cell: number) => dispatch({ type: 'TAP', cell }), []);
  const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), []);
  const hint = useCallback(() => dispatch({ type: 'HINT_ON' }), []);
  const newLevel = useCallback(
    (index: number) => dispatch({ type: 'NEW', index }),
    [],
  );

  return {
    level: state.level,
    cells: state.level.cells,
    head: state.head,
    movesUsed: state.movesUsed,
    movesLimit: state.level.movesLimit,
    hintsLeft: state.hintsLeft,
    hintActive: state.hintActive,
    shakeTick: state.shakeTick,
    status,
    nextTargetIndex,
    nextTargetValue,
    pathCells,
    tap,
    undo,
    restart,
    hint,
    newLevel,
  };
}
