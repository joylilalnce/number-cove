import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Undo2, RotateCcw, Lightbulb } from 'lucide-react-native';
import { theme } from '../constants/theme';

type IconType = React.ComponentType<any>;

function ControlButton({
  Icon,
  label,
  onPress,
  disabled,
  badge,
}: {
  Icon: IconType;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  badge?: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      onPressIn={() =>
        Animated.spring(scale, {
          toValue: 0.92,
          useNativeDriver: true,
          tension: 160,
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
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={styles.btn}>
      <Animated.View
        style={[
          styles.btnInner,
          { opacity: disabled ? 0.4 : 1, transform: [{ scale }] },
        ]}>
        <Icon size={24} color={theme.colors.ocean.deep} strokeWidth={2.2} />
        <Text style={styles.label}>{label}</Text>
        {badge ? <Text style={styles.badge}>{badge}</Text> : null}
      </Animated.View>
    </Pressable>
  );
}

interface Props {
  canUndo: boolean;
  hintsLeft: number;
  onUndo: () => void;
  onRestart: () => void;
  onHint: () => void;
}

/** Floating control bar (archetype G2) pinned near the bottom of the game area. */
function FloatingControls({
  canUndo,
  hintsLeft,
  onUndo,
  onRestart,
  onHint,
}: Props) {
  return (
    <View style={styles.panel} pointerEvents="box-none">
      <ControlButton
        Icon={Undo2}
        label="UNDO"
        onPress={onUndo}
        disabled={!canUndo}
      />
      <View style={styles.divider} />
      <ControlButton Icon={RotateCcw} label="RESTART" onPress={onRestart} />
      <View style={styles.divider} />
      <ControlButton
        Icon={Lightbulb}
        label="HINT"
        onPress={onHint}
        disabled={hintsLeft <= 0}
        badge={hintsLeft > 0 ? String(hintsLeft) : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 10,
    paddingHorizontal: 8,
    ...theme.shadow.card,
  },
  btn: { minWidth: 72, height: 56, borderRadius: theme.radius.md },
  btnInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: theme.colors.text.secondary,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: 10,
    fontSize: 10,
    fontWeight: '800',
    color: theme.colors.ocean.wave,
    fontVariant: ['tabular-nums'] as const,
  },
  divider: {
    width: 1,
    height: 34,
    backgroundColor: theme.colors.divider,
  },
});

export default React.memo(FloatingControls);
