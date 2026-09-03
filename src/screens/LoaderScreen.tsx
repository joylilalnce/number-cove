import React, { useEffect, useRef } from 'react';
import { Animated, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Bubbles from '../components/Bubbles';
import { theme } from '../constants/theme';
import { LOADER_DURATION_MS } from '../constants/config';

interface Props {
  onDone: () => void;
}

const BAR_W = 190;

/** Branded splash on a deep-ocean palette — deliberately darker than the Menu. */
export default function LoaderScreen({ onDone }: Props) {
  const cardScale = useRef(new Animated.Value(0.6)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(16)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(titleY, {
        toValue: 0,
        duration: 500,
        delay: 250,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 500,
        delay: 250,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // width animation must NOT use the native driver
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      useNativeDriver: false,
    }).start();

    const t = setTimeout(onDone, LOADER_DURATION_MS);
    return () => clearTimeout(t);
  }, [cardScale, cardOpacity, titleY, titleOpacity, glow, progress, onDone]);

  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 0.85],
  });
  const barFill = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_W],
  });

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={theme.gradients.dark}
        style={StyleSheet.absoluteFill}
      />
      <Bubbles count={80} dark />

      <View style={styles.center}>
        <Animated.View
          style={[
            styles.card,
            { opacity: cardOpacity, transform: [{ scale: cardScale }] },
          ]}>
          <LinearGradient
            colors={['#00A6CB', '#00558B']}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.9, y: 1 }}
            style={styles.cardGrad}>
            <Animated.View style={[styles.node, { opacity: glowOpacity }]} />
            <View style={styles.nodeDot} />
          </LinearGradient>
        </Animated.View>

        <Animated.View
          style={{ opacity: titleOpacity, transform: [{ translateY: titleY }] }}
          pointerEvents="none">
          <Text style={styles.title}>NUMBER COVE</Text>
          <Text style={styles.subtitle}>CONNECT THE PATH</Text>
        </Animated.View>
      </View>

      <View style={styles.bottom}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width: barFill }]}>
            <LinearGradient
              colors={theme.gradients.progress}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>
        <Text style={styles.loading}>LOADING…</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.dark.top },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 26 },
  card: {
    width: 128,
    height: 128,
    borderRadius: 30,
    shadowColor: '#00A6CB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  cardGrad: {
    flex: 1,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  node: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7FE8C5',
  },
  nodeDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EAF7FB',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 3,
    color: '#EAF7FB',
    textAlign: 'center',
    textShadowColor: 'rgba(0,166,203,0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 4,
    color: '#7FC6D9',
    textAlign: 'center',
  },
  bottom: { alignItems: 'center', paddingBottom: 70, gap: 12 },
  track: {
    width: BAR_W,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  fill: { height: 4, borderRadius: 2, overflow: 'hidden' },
  loading: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 3,
    color: '#5FA9BF',
  },
});
