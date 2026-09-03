import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

interface Props {
  used: number;
  limit: number;
}

/** Header moves counter that shifts colour as the budget runs out. */
function MovesPill({ used, limit }: Props) {
  const left = limit - used;
  const color =
    left <= 0
      ? theme.colors.error
      : left <= 3
      ? theme.colors.highlight
      : theme.colors.ocean.wave;

  return (
    <View style={[styles.pill, { borderColor: color, backgroundColor: color + '18' }]}>
      <Text style={[styles.text, { color }]}>
        {used}/{limit}
      </Text>
      <Text style={[styles.cap, { color }]}>MOVES</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    minWidth: 64,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'] as const,
    lineHeight: 18,
  },
  cap: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
});

export default React.memo(MovesPill);
