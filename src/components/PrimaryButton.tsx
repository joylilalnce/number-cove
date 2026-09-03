import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { theme } from '../constants/theme';

type IconType = React.ComponentType<any>;

interface Props {
  label: string;
  onPress: () => void;
  Icon?: IconType;
  colors?: string[];
  height?: number;
  width?: number | string;
}

/**
 * Gradient CTA. Pressable is the PARENT; the Animated.View scale lives INSIDE it
 * (working press-feedback pattern on this stack — rule #8). The icon row follows
 * the strict centering contract (rule #14/#20): fixed 24px icon, lineHeight 24,
 * gap 10.
 */
export default function PrimaryButton({
  label,
  onPress,
  Icon,
  colors = theme.gradients.cta,
  height = 60,
  width = '100%',
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.96,
      tension: 120,
      friction: 7,
      useNativeDriver: true,
    }).start();
  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      tension: 120,
      friction: 7,
      useNativeDriver: true,
    }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[styles.press, { width: width as any, height }]}>
      <Animated.View style={[styles.fill, { transform: [{ scale }] }]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.grad, { borderRadius: theme.radius.lg }]}>
          <View style={styles.row}>
            {Icon ? <Icon size={24} color="#FFFFFF" strokeWidth={2.4} /> : null}
            <Text style={styles.label}>{label}</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    alignSelf: 'center',
    ...theme.shadow.cta,
    borderRadius: theme.radius.lg,
  },
  fill: { flex: 1, borderRadius: theme.radius.lg },
  grad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
    lineHeight: 24,
  },
});
