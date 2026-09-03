import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';

type IconType = React.ComponentType<any>;

interface Props {
  Icon: IconType;
  value: string;
  label: string;
  color?: string;
}

/**
 * One SOFT_UI stat pill, reused identically on Menu / Result / LevelMap for
 * cross-screen consistency. width:'100%' so a `flex:1` parent slot sizes it —
 * never `flex:1` on the card itself (rule #17 circular-flex bug). The icon is a
 * fixed 22px lucide glyph, uniform across every pill (rule #15).
 */
function StatCard({ Icon, value, label, color = theme.colors.ocean.wave }: Props) {
  return (
    <View style={[styles.card, { borderColor: color + '44' }]}>
      <View style={[styles.iconWrap, { backgroundColor: color + '1A' }]}>
        <Icon size={22} color={color} strokeWidth={2.4} />
      </View>
      <Text style={[styles.value, { color }]} numberOfLines={1}>
        {value}
      </Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 6,
    ...theme.shadow.card,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'] as const,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: theme.colors.text.muted,
  },
});

export default React.memo(StatCard);
