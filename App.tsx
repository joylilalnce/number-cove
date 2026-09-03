/**
 * NumberCove — connect-the-numbers path puzzle.
 * App-level state machine (rule #2): a single Screen union + conditional render,
 * no react-navigation.
 */
import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import LevelMapScreen from './src/screens/LevelMapScreen';
import GameScreen from './src/screens/GameScreen';
import ResultScreen from './src/screens/ResultScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { useProgress } from './src/hooks/useProgress';
import { TOTAL_LEVELS } from './src/constants/config';
import { GameResult } from './src/game/types';
import { theme } from './src/constants/theme';

type Screen = 'loader' | 'menu' | 'levelmap' | 'game' | 'result' | 'settings';

export default function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [activeLevel, setActiveLevel] = useState(1);
  const [gameNonce, setGameNonce] = useState(0);
  const [lastResult, setLastResult] = useState<GameResult | null>(null);

  const {
    progress,
    setCurrentLevel,
    completeLevel,
    updateSettings,
    resetProgress,
  } = useProgress();

  const startLevel = useCallback(
    (level: number) => {
      const clamped = Math.max(1, Math.min(TOTAL_LEVELS, level));
      setActiveLevel(clamped);
      setCurrentLevel(clamped);
      setGameNonce((n) => n + 1);
      setScreen('game');
    },
    [setCurrentLevel],
  );

  const handleGameOver = useCallback(
    (result: GameResult) => {
      setLastResult(result);
      if (result.outcome === 'win') {
        completeLevel(result.level, result.moves);
      }
      setScreen('result');
    },
    [completeLevel],
  );

  const completed = Object.keys(progress.bestMoves).length;

  let content: React.ReactNode = null;

  if (screen === 'loader') {
    content = <LoaderScreen onDone={() => setScreen('menu')} />;
  } else if (screen === 'menu') {
    content = (
      <MenuScreen
        currentLevel={progress.currentLevel}
        unlocked={progress.unlocked}
        completed={completed}
        onPlay={() => startLevel(progress.currentLevel)}
        onLevels={() => setScreen('levelmap')}
        onSettings={() => setScreen('settings')}
      />
    );
  } else if (screen === 'levelmap') {
    content = (
      <LevelMapScreen
        unlocked={progress.unlocked}
        current={progress.currentLevel}
        bestMoves={progress.bestMoves}
        onPick={startLevel}
        onBack={() => setScreen('menu')}
      />
    );
  } else if (screen === 'game') {
    content = (
      <GameScreen
        key={gameNonce}
        level={activeLevel}
        settings={progress.settings}
        onGameOver={handleGameOver}
        onBack={() => setScreen('menu')}
      />
    );
  } else if (screen === 'result' && lastResult) {
    content = (
      <ResultScreen
        result={lastResult}
        isLast={lastResult.level >= TOTAL_LEVELS}
        onAgain={() => startLevel(lastResult.level)}
        onNext={() => startLevel(lastResult.level + 1)}
        onMap={() => setScreen('levelmap')}
      />
    );
  } else if (screen === 'settings') {
    content = (
      <SettingsScreen
        settings={progress.settings}
        onChange={updateSettings}
        onReset={resetProgress}
        onBack={() => setScreen('menu')}
      />
    );
  } else {
    // safety fallback (e.g. result with no payload) — return to menu
    content = (
      <MenuScreen
        currentLevel={progress.currentLevel}
        unlocked={progress.unlocked}
        completed={completed}
        onPlay={() => startLevel(progress.currentLevel)}
        onLevels={() => setScreen('levelmap')}
        onSettings={() => setScreen('settings')}
      />
    );
  }

  return <View style={styles.root}>{content}</View>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.dark.top },
});
