import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Volume2, Vibrate, Eye, Trash2 } from 'lucide-react-native';
import ScreenHeader from '../components/ScreenHeader';
import SecondaryButton from '../components/SecondaryButton';
import Bubbles from '../components/Bubbles';
import { theme } from '../constants/theme';
import { Settings } from '../hooks/useProgress';

type IconType = React.ComponentType<any>;

function Toggle({ value, onToggle }: { value: boolean; onToggle: () => void }) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [value, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 22],
  });

  return (
    <Pressable
      onPress={onToggle}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={[
        styles.track,
        { backgroundColor: value ? theme.colors.ocean.wave : theme.colors.border },
      ]}>
      <Animated.View style={[styles.knob, { transform: [{ translateX }] }]} />
    </Pressable>
  );
}

function Row({
  Icon,
  label,
  value,
  onToggle,
}: {
  Icon: IconType;
  label: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: theme.colors.ocean.wave + '18' }]}>
        <Icon size={20} color={theme.colors.ocean.deep} strokeWidth={2.2} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Toggle value={value} onToggle={onToggle} />
    </View>
  );
}

interface Props {
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
  onReset: () => void;
  onBack: () => void;
}

export default function SettingsScreen({ settings, onChange, onReset, onBack }: Props) {
  const [confirming, setConfirming] = useState(false);

  const doReset = () => {
    if (confirming) {
      onReset();
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={theme.gradients.light}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Bubbles count={20} />

      <ScreenHeader title="SETTINGS" onBack={onBack} />

      <View style={styles.body}>
        <View style={styles.card}>
          <Row
            Icon={Volume2}
            label="Sound"
            value={settings.sound}
            onToggle={() => onChange({ sound: !settings.sound })}
          />
          <View style={styles.sep} />
          <Row
            Icon={Vibrate}
            label="Haptics"
            value={settings.haptics}
            onToggle={() => onChange({ haptics: !settings.haptics })}
          />
          <View style={styles.sep} />
          <Row
            Icon={Eye}
            label="Show next-target hint"
            value={settings.hints}
            onToggle={() => onChange({ hints: !settings.hints })}
          />
        </View>

        <View style={styles.resetArea}>
          {confirming ? (
            <Text style={styles.confirmHint}>TAP AGAIN TO CONFIRM RESET</Text>
          ) : null}
          <SecondaryButton
            label={confirming ? 'CONFIRM RESET' : 'RESET PROGRESS'}
            Icon={Trash2}
            onPress={doReset}
            danger
          />
        </View>
      </View>

      <Text style={styles.about}>NumberCove v1.0 · connect the cove</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.top },
  body: { flex: 1, paddingHorizontal: 24, paddingTop: 8, gap: 20 },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    ...theme.shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  sep: { height: 1, backgroundColor: theme.colors.divider },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: 'center',
  },
  knob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    ...theme.shadow.soft,
  },
  resetArea: { gap: 8 },
  confirmHint: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: theme.colors.error,
    textAlign: 'center',
  },
  about: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.text.muted,
    paddingBottom: 28,
  },
});
