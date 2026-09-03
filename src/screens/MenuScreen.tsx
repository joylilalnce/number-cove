import React, { useEffect, useRef } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Play, LayoutGrid, Settings, Waves, LockOpen, Star } from 'lucide-react-native';
import Bubbles from '../components/Bubbles';
import StatCard from '../components/StatCard';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { theme } from '../constants/theme';
import { TOTAL_LEVELS } from '../constants/config';

interface Props {
  currentLevel: number;
  unlocked: number;
  completed: number;
  onPlay: () => void;
  onLevels: () => void;
  onSettings: () => void;
}

export default function MenuScreen({
  currentLevel,
  unlocked,
  completed,
  onPlay,
  onLevels,
  onSettings,
}: Props) {
  const enter = useRef(new Animated.Value(0)).current;
  const heroScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(heroScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(enter, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [enter, heroScale]);

  const translateY = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={theme.gradients.light}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Bubbles count={26} />

      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Star size={13} color={theme.colors.highlight} fill={theme.colors.highlight} />
          <Text style={styles.badgeText}>BEST {completed}</Text>
        </View>
      </View>

      <Animated.View
        style={[styles.hero, { opacity: enter, transform: [{ translateY }] }]}
        pointerEvents="none">
        <Animated.View style={[styles.heroTile, { transform: [{ scale: heroScale }] }]}>
          <LinearGradient
            colors={['#00A6CB', '#00558B']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={styles.heroGrad}>
            <View style={styles.heroDot} />
          </LinearGradient>
        </Animated.View>
        <Text style={styles.title}>NUMBER COVE</Text>
        <Text style={styles.tagline}>CONNECT NUMBERS · BUILD THE PATH</Text>
      </Animated.View>

      <Animated.View
        style={[styles.infoRow, { opacity: enter, transform: [{ translateY }] }]}
        pointerEvents="none">
        <View style={styles.slot}>
          <StatCard
            Icon={Waves}
            value={String(currentLevel)}
            label="Level"
            color={theme.colors.ocean.wave}
          />
        </View>
        <View style={styles.slot}>
          <StatCard
            Icon={LockOpen}
            value={`${unlocked}/${TOTAL_LEVELS}`}
            label="Unlocked"
            color={theme.colors.ocean.deep}
          />
        </View>
      </Animated.View>

      <View style={styles.cta}>
        <PrimaryButton label="PLAY" Icon={Play} onPress={onPlay} width={296} />
        <View style={styles.secRow}>
          <SecondaryButton label="LEVELS" Icon={LayoutGrid} onPress={onLevels} flex />
          <SecondaryButton label="SETTINGS" Icon={Settings} onPress={onSettings} flex />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.top },
  topRow: {
    paddingTop: 44,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: theme.colors.ocean.deep,
    fontVariant: ['tabular-nums'] as const,
  },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  heroTile: {
    width: 96,
    height: 96,
    borderRadius: 26,
    shadowColor: '#00A6CB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 10,
  },
  heroGrad: {
    flex: 1,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EAF7FB',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 1,
    color: theme.colors.text.primary,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    color: theme.colors.text.secondary,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  slot: { flex: 1 },
  cta: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  secRow: { flexDirection: 'row', gap: 12 },
});
