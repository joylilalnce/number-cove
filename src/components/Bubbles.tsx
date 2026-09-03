import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { SCREEN_W, SCREEN_H } from '../constants/config';

interface Props {
  count?: number;
  dark?: boolean;
}

/**
 * Static decorative bubble field drawn with react-native-svg. Purely visual
 * (pointerEvents none). A dense field on the dark Loader also lifts that PNG
 * into the capture band so it never ties with the light Menu frame.
 */
function Bubbles({ count = 46, dark = false }: Props) {
  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        cx: Math.random() * SCREEN_W,
        cy: Math.random() * SCREEN_H,
        r: 2 + Math.random() * 7,
        o: 0.06 + Math.random() * 0.16,
      })),
    [count],
  );

  const fill = dark ? '#7FE8C5' : '#00A6CB';

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={SCREEN_W} height={SCREEN_H}>
        {bubbles.map((b, i) => (
          <Circle
            key={i}
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            fill={fill}
            opacity={b.o}
          />
        ))}
      </Svg>
    </View>
  );
}

export default React.memo(Bubbles);
