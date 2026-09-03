import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { theme } from '../constants/theme';
import { CONTENT_W, CONTENT_H } from '../constants/config';

interface Props {
  points: { x: number; y: number }[];
}

/**
 * The connecting path drawn beneath the tiles (absolute fill over the content
 * area). Sitting under the tiles means it only shows through the gaps, reading
 * as clean connectors between connected numbers without covering the digits.
 */
function PathLine({ points }: Props) {
  if (points.length < 2) return null;
  const str = points.map((p) => `${p.x},${p.y}`).join(' ');
  return (
    <Svg
      style={StyleSheet.absoluteFill}
      width={CONTENT_W}
      height={CONTENT_H}
      pointerEvents="none">
      <Polyline
        points={str}
        fill="none"
        stroke={theme.colors.ocean.wave}
        strokeWidth={9}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.9}
      />
    </Svg>
  );
}

export default React.memo(PathLine);
