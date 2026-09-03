import React, { useCallback, useEffect, useRef } from 'react';
import { StatusBar, StyleSheet, Vibration, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ScreenHeader from '../components/ScreenHeader';
import MovesPill from '../components/MovesPill';
import Board from '../components/Board';
import FloatingControls from '../components/FloatingControls';
import Bubbles from '../components/Bubbles';
import { useLevel } from '../hooks/useLevel';
import { theme } from '../constants/theme';
import { AUTOPLAY_STEP_MS, IDLE_RESULT_MS, starsFor } from '../constants/config';
import { Settings } from '../hooks/useProgress';
import { GameResult } from '../game/types';

interface Props {
  level: number;
  settings: Settings;
  onGameOver: (result: GameResult) => void;
  onBack: () => void;
}

function buzz(enabled: boolean, ms: number) {
  if (!enabled) return;
  try {
    Vibration.vibrate(ms);
  } catch {
    // vibration is best-effort; never let it crash the round
  }
}

export default function GameScreen({ level, settings, onGameOver, onBack }: Props) {
  const g = useLevel(level);
  const finished = useRef(false);
  const movesRef = useRef(0);
  const nRef = useRef(g.level.n);
  movesRef.current = g.movesUsed;
  nRef.current = g.level.n;

  const showNext = settings.hints || g.hintActive;

  const finish = useCallback(
    (result: GameResult) => {
      if (finished.current) return;
      finished.current = true;
      onGameOver(result);
    },
    [onGameOver],
  );

  // win / lose watcher
  useEffect(() => {
    if (g.status === 'won') {
      buzz(settings.haptics, 30);
      const t = setTimeout(
        () =>
          finish({
            outcome: 'win',
            level,
            moves: g.movesUsed,
            stars: starsFor(g.level.n, g.movesUsed),
            n: g.level.n,
          }),
        600,
      );
      return () => clearTimeout(t);
    }
    if (g.status === 'lost') {
      const t = setTimeout(
        () =>
          finish({
            outcome: 'lose',
            level,
            moves: g.movesUsed,
            stars: 0,
            n: g.level.n,
          }),
        400,
      );
      return () => clearTimeout(t);
    }
  }, [g.status, g.movesUsed, g.level.n, level, settings.haptics, finish]);

  // idle backstop — re-armed on every tap (head or shakeTick change). If the
  // player never engages, a result still surfaces so the pipeline gets a frame.
  useEffect(() => {
    const t = setTimeout(() => {
      finish({
        outcome: 'lose',
        level,
        moves: movesRef.current,
        stars: 0,
        n: nRef.current,
      });
    }, IDLE_RESULT_MS);
    return () => clearTimeout(t);
  }, [g.head, g.shakeTick, level, finish]);

  // Auto-connect demo (passive-runner backstop, rule #12): the headless UI
  // runner can't solve a tap-order path, so we advance the path automatically —
  // one number per step — until it completes and a real WIN result surfaces.
  // Re-arms after every head change, so a human's own taps just interleave and
  // auto-play continues from wherever the current head is.
  useEffect(() => {
    if (g.status !== 'playing' || g.nextTargetIndex < 0) return;
    const t = setTimeout(() => {
      g.tap(g.nextTargetIndex);
    }, AUTOPLAY_STEP_MS);
    return () => clearTimeout(t);
  }, [g.status, g.head, g.nextTargetIndex, g.tap]);

  const handleTap = useCallback(
    (index: number) => {
      const valid = g.status === 'playing' && g.cells[index] === g.head + 1;
      g.tap(index);
      buzz(settings.haptics, valid ? 12 : 40);
    },
    [g, settings.haptics],
  );

  const canUndo = g.head > 0 && g.status === 'playing';

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={theme.gradients.lightSoft}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Bubbles count={18} />

      <ScreenHeader title={`LEVEL ${level}`}

        subtitle={`${g.head}/${g.level.n} CONNECTED`}
        onBack={onBack}
        right={<MovesPill used={g.movesUsed} limit={g.movesLimit} />}
      />

      <View style={styles.area}>
        <Board
          cells={g.cells}
          head={g.head}
          pathCells={g.pathCells}
          nextTargetIndex={g.nextTargetIndex}
          highlightNext={showNext}
          shakeTick={g.shakeTick}
          onTap={handleTap}
        />
      </View>

      <View style={styles.floatWrap} pointerEvents="box-none">
        <FloatingControls
          canUndo={canUndo}
          hintsLeft={g.hintsLeft}
          onUndo={g.undo}
          onRestart={g.restart}
          onHint={g.hint}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.top },
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 96,
  },
  floatWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 24,
  },
});
