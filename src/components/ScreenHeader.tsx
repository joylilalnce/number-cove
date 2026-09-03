import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { theme } from '../constants/theme';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

/** Round back button with press feedback (Pressable parent, inner scale). */
function BackButton({ onPress }: { onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() =>
        Animated.spring(scale, {
          toValue: 0.9,
          useNativeDriver: true,
          tension: 140,
          friction: 7,
        }).start()
      }
      onPressOut={() =>
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 140,
          friction: 7,
        }).start()
      }
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={styles.backPress}>
      <Animated.View style={[styles.backInner, { transform: [{ scale }] }]}>
        <ChevronLeft size={24} color={theme.colors.ocean.deep} strokeWidth={2.4} />
      </Animated.View>
    </Pressable>
  );
}

/**
 * Shared header reused on every screen with a top bar (rule #12 consistency).
 * paddingTop:44 clears the status bar (rule #6).
 */
function ScreenHeader({ title, subtitle, onBack, right }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.side}>
        {onBack ? <BackButton onPress={onBack} /> : null}
      </View>
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const SIDE = 56;

const styles = StyleSheet.create({
  header: {
    paddingTop: 44,
    height: 116,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  side: { width: SIDE, justifyContent: 'center' },
  right: { alignItems: 'flex-end' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: theme.colors.text.primary,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: theme.colors.text.secondary,
    fontVariant: ['tabular-nums'] as const,
  },
  backPress: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  backInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.soft,
  },
});

export default React.memo(ScreenHeader);
