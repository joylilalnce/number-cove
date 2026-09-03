import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';
import { GAP, TILE } from '../constants/config';

interface Props {
  index: number;
  value: number; // 0 = water/empty
  connected: boolean;
  isTarget: boolean;
  onPress: (index: number) => void;
}

function Tile({ index, value, connected, isTarget, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  // gentle pulse on the next-target tile to guide the tap
  useEffect(() => {
    if (!isTarget) {
      scale.stopAnimation(() => scale.setValue(1));
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.07,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isTarget, scale]);

  const row = Math.floor(index / 5);
  const col = index % 5;

  let bg = theme.colors.surfaceAlt; // water
  let border = theme.colors.border;
  let textColor = theme.colors.ocean.deep;
  if (connected) {
    bg = theme.colors.ocean.wave;
    border = theme.colors.ocean.deep;
    textColor = '#FFFFFF';
  } else if (isTarget) {
    bg = '#FFF6E6';
    border = theme.colors.highlight;
  } else if (value > 0) {
    bg = '#FFFFFF';
  }

  const pos = {
    left: col * (TILE + GAP),
    top: row * (TILE + GAP),
    width: TILE,
    height: TILE,
  };

  return (
    <Pressable
      onPress={() => onPress(index)}
      onPressIn={() =>
        Animated.spring(scale, {
          toValue: isTarget ? 1.07 : 0.93,
          useNativeDriver: true,
          tension: 200,
          friction: 8,
        }).start()
      }
      onPressOut={() =>
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 160,
          friction: 8,
        }).start()
      }
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      style={[styles.press, pos]}>
      <Animated.View
        style={[
          styles.tile,
          {
            backgroundColor: bg,
            borderColor: border,
            borderWidth: isTarget ? 2 : 1,
            transform: [{ scale }],
          },
        ]}>
        {value > 0 ? (
          <Text style={[styles.num, { color: textColor }]}>{value}</Text>
        ) : null}
        {connected ? <Text style={styles.check}>✓</Text> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { position: 'absolute' },
  tile: {
    flex: 1,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  num: {
    fontSize: 24,
    fontWeight: '800',
    fontVariant: ['tabular-nums'] as const,
  },
  check: {
    position: 'absolute',
    bottom: 3,
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
  },
});

export default React.memo(Tile);
