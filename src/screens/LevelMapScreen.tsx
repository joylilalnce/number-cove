import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Lock, Star } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import Bubbles from '../components/Bubbles';
import { theme } from '../constants/theme';
import { SCREEN_W, TOTAL_LEVELS, seqLength, starsFor } from '../constants/config';
import { stars as starStr } from '../utils/format';

interface Props {
  unlocked: number;
  current: number;
  bestMoves: Record<number, number>;
  onPick: (level: number) => void;
  onBack: () => void;
}

const NODE = Math.floor((SCREEN_W - 48 - 2 * 14) / 3);

function LevelNode({
  level,
  locked,
  isCurrent,
  starCount,
  index,
  onPick,
}: {
  level: number;
  locked: boolean;
  isCurrent: boolean;
  starCount: number;
  index: number;
  onPick: (level: number) => void;
}) {
  const enter = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      tension: 70,
      friction: 8,
      delay: index * 45,
      useNativeDriver: true,
    }).start();
  }, [enter, index]);

  const enterScale = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const body = (
    <Animated.View
      style={[
        styles.node,
        locked ? styles.nodeLocked : styles.nodeOpen,
        isCurrent ? styles.nodeCurrent : null,
        { opacity: enter, transform: [{ scale: locked ? enterScale : scale }] },
      ]}>
      {locked ? (
        <Lock size={24} color={theme.colors.borderStrong} strokeWidth={2.2} />
      ) : (
        <>
          <Text style={styles.nodeNum}>{level}</Text>
          {starCount > 0 ? (
            <Text style={styles.nodeStars}>{starStr(starCount)}</Text>
          ) : (
            <Text style={styles.nodeDash}>· · ·</Text>
          )}
        </>
      )}
    </Animated.View>
  );

  if (locked) {
    return <View style={styles.slot}>{body}</View>;
  }

  return (
    <Pressable
      onPress={() => onPick(level)}
      onPressIn={() =>
        Animated.spring(scale, {
          toValue: 0.93,
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
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      style={styles.slot}>
      {body}
    </Pressable>
  );
}

export default function LevelMapScreen({
  unlocked,
  current,
  bestMoves,
  onPick,
  onBack,
}: Props) {
  const levels = Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={theme.gradients.lightSoft}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Bubbles count={20} />

      <ScreenHeader title="LEVELS"
        onBack={onBack}
        right={
          <View style={styles.badge}>
            <Star size={13} color={theme.colors.highlight} fill={theme.colors.highlight} />
            <Text style={styles.badgeText}>{unlocked}/{TOTAL_LEVELS}</Text>
          </View>
        }
      />

      <View style={styles.grid}>
        {levels.map((lv, i) => {
          const locked = lv > unlocked;
          const best = bestMoves[lv];
          const starCount =
            best === undefined ? 0 : starsFor(seqLength(lv), best);
          return (
            <LevelNode
              key={lv}
              level={lv}
              locked={locked}
              isCurrent={lv === current}
              starCount={starCount}
              index={i}
              onPick={onPick}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.top },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.ocean.deep,
    fontVariant: ['tabular-nums'] as const,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 14,
    paddingHorizontal: 24,
  },
  slot: { width: NODE, height: NODE },
  node: {
    flex: 1,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  nodeOpen: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  nodeLocked: {
    backgroundColor: theme.colors.bg.mid,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  nodeCurrent: {
    borderWidth: 2,
    borderColor: theme.colors.ocean.wave,
  },
  nodeNum: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.ocean.deep,
    fontVariant: ['tabular-nums'] as const,
  },
  nodeStars: {
    fontSize: 13,
    color: theme.colors.highlight,
    letterSpacing: 1,
  },
  nodeDash: {
    fontSize: 12,
    color: theme.colors.text.muted,
    letterSpacing: 2,
  },
});
