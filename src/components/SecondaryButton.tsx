import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type IconType = React.ComponentType<any>;

interface Props {
  label: string;
  onPress: () => void;
  Icon?: IconType;
  flex?: boolean;
  danger?: boolean;
}

/** Outline SOFT_UI secondary button, h48. Pressable parent + inner scale. */
export default function SecondaryButton({
  label,
  onPress,
  Icon,
  flex = false,
  danger = false,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const tint = danger ? theme.colors.error : theme.colors.ocean.deep;
  const border = danger ? '#F3B4B4' : theme.colors.borderStrong;

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
      style={[styles.press, flex ? styles.flex : styles.auto]}>
      <Animated.View
        style={[
          styles.inner,
          { borderColor: border, transform: [{ scale }] },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={20} color={tint} strokeWidth={2.2} /> : null}
          <Text style={[styles.label, { color: tint }]}>{label}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: { height: 48, borderRadius: theme.radius.md },
  flex: { flex: 1 },
  auto: { alignSelf: 'stretch' },
  inner: {
    flex: 1,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.soft,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 20,
  },
});
