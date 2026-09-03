import { useState, useCallback } from 'react';
import { TOTAL_LEVELS } from '../constants/config';

export interface Settings {
  sound: boolean;
  haptics: boolean;
  hints: boolean;
}

export interface Progress {
  unlocked: number; // highest unlocked level (1..TOTAL_LEVELS)
  currentLevel: number;
  bestMoves: Record<number, number>;
  settings: Settings;
}

const DEFAULT: Progress = {
  unlocked: 1,
  currentLevel: 1,
  bestMoves: {},
  settings: { sound: true, haptics: true, hints: true },
};

/**
 * In-memory progress store. Persistence is intentionally graceful: no native
 * storage dependency is added (keeps the build lean and robust), so progress
 * lives for the session. All mutators are pure state updates.
 */
export function useProgress() {
  const [progress, setProgress] = useState<Progress>(DEFAULT);

  const setCurrentLevel = useCallback((level: number) => {
    setProgress((p) => ({ ...p, currentLevel: level }));
  }, []);

  // called on a win: record best moves + unlock the next level
  const completeLevel = useCallback((level: number, moves: number) => {
    setProgress((p) => {
      const prevBest = p.bestMoves[level];
      const bestMoves = {
        ...p.bestMoves,
        [level]: prevBest === undefined ? moves : Math.min(prevBest, moves),
      };
      const unlocked = Math.min(TOTAL_LEVELS, Math.max(p.unlocked, level + 1));
      return { ...p, bestMoves, unlocked };
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setProgress((p) => ({ ...p, settings: { ...p.settings, ...patch } }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress((p) => ({ ...DEFAULT, settings: p.settings }));
  }, []);

  return {
    progress,
    setCurrentLevel,
    completeLevel,
    updateSettings,
    resetProgress,
  };
}
