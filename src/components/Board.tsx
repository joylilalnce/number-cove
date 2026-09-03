import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Tile from './Tile';
import PathLine from './PathLine';
import { theme } from '../constants/theme';
import {
  BOARD_BORDER,
  BOARD_PAD,
  BOARD_W,
  CONTENT_H,
  CONTENT_W,
  GAP,
  TILE,
} from '../constants/config';

interface Props {
  cells: number[];
  head: number;
  pathCells: number[];
  nextTargetIndex: number;
  highlightNext: boolean;
  shakeTick: number;
  onTap: (index: number) => void;
}

const center = (index: number) => {
  const row = Math.floor(index / 5);
  const col = index % 5;
  return {
    x: col * (TILE + GAP) + TILE / 2,
    y: row * (TILE + GAP) + TILE / 2,
  };
};

function Board({
  cells,
  head,
  pathCells,
  nextTargetIndex,
  highlightNext,
  shakeTick,
  onTap,
}: Props) {
  const shake = useRef(new Animated.Value(0)).current;
  const first = useRef(true);

  // shake the whole board on an invalid tap
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 45, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 45, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 45, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 45, useNativeDriver: true }),
    ]).start();
  }, [shakeTick, shake]);

  const translateX = shake.interpolate({
    inputRange: [-1, 1],
    outputRange: [-7, 7],
  });

  const points = useMemo(() => pathCells.map(center), [pathCells]);

  return (
    <Animated.View style={[styles.board, { transform: [{ translateX }] }]}>
      <View style={styles.content}>
        <PathLine points={points} />
        {cells.map((value, index) => {
          const connected = value > 0 && value <= head;
          const isTarget = highlightNext && index === nextTargetIndex;
          return (
            <Tile
              key={index}
              index={index}
              value={value}
              connected={connected}
              isTarget={isTarget}
              onPress={onTap}
            />
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: BOARD_W,
    padding: BOARD_PAD,
    borderWidth: BOARD_BORDER,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.surface,
    alignSelf: 'center',
    ...theme.shadow.card,
  },
  content: {
    width: CONTENT_W,
    height: CONTENT_H,
    position: 'relative',
  },
});

export default React.memo(Board);
