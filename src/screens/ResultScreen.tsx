import React, { useEffect, useRef } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BadgeCheck, XCircle, Route, Waves, Star, Map } from 'lucide-react-native';
import Bubbles from '../components/Bubbles';
import StatCard from '../components/StatCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { theme } from '../constants/theme';
import { GameResult } from '../game/types';

interface Props {
  result: GameResult;
  isLast: boolean;
  onAgain: () => void;
  onNext: () => void;
  onMap: () => void;
}

export default function ResultScreen({
  result,
  isLast,
  onAgain,
  onNext,
  onMap,
}: Props) {
  const win = result.outcome === 'win';
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scale, opacity]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={win ? theme.gradients.win : theme.gradients.lose}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {win ? <Bubbles count={40} dark /> : null}

      <View style={styles.center}>
        <Animated.View
          style={[styles.card, { opacity, transform: [{ scale }] }]}
          pointerEvents="none">
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: win ? theme.colors.success + '22' : theme.colors.error + '22' },
            ]}>
            {win ? (
              <BadgeCheck size={64} color={theme.colors.success} strokeWidth={2} />
            ) : (
              <XCircle size={64} color={theme.colors.error} strokeWidth={2} />
            )}
          </View>

          <Text style={styles.title}>{win ? 'PATH COMPLETE!' : 'OUT OF MOVES'}</Text>
          <Text style={styles.sub}>
            {win ? 'The cove is connected' : 'Try a tighter route'}
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.slot}>
              <StatCard
                Icon={Route}
                value={String(result.moves)}
                label="Moves"
                color={theme.colors.ocean.wave}
              />
            </View>
            <View style={styles.slot}>
              <StatCard
                Icon={Waves}
                value={String(result.level)}
                label="Level"
                color={theme.colors.ocean.deep}
              />
            </View>
            {win ? (
              <View style={styles.slot}>
                <StatCard
                  Icon={Star}
                  value={String(result.stars)}
                  label="Stars"
                  color={theme.colors.highlight}
                />
              </View>
            ) : null}
          </View>
        </Animated.View>
      </View>

      <View style={styles.cta}>
        {win && !isLast ? (
          <PrimaryButton
            label="NEXT LEVEL"
            onPress={onNext}
            colors={['#2ED47A', '#00A6CB']}
          />
        ) : null}
        {win && isLast ? (
          <PrimaryButton
            label="ALL CLEAR"
            onPress={onMap}
            colors={['#FFD66B', '#FF8C61']}
          />
        ) : null}
        <PrimaryButton label="PLAY AGAIN" onPress={onAgain} />
        <SecondaryButton label="LEVEL MAP" Icon={Map} onPress={onMap} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.ocean.deep },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  card: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.xl,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
    ...theme.shadow.card,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  sub: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text.secondary,
    marginBottom: 8,
  },
  statsRow: { flexDirection: 'row', gap: 10, width: '100%', marginTop: 4 },
  slot: { flex: 1 },
  cta: { paddingHorizontal: 24, paddingBottom: 40, gap: 12 },
});
