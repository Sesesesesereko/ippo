// 小さな印（種類の形の印など）。react-native-svg で描くので Web とスマホで同じに見える。
import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Category } from '../domain/types';

interface P {
  size?: number;
  color: string;
}

export function CategoryIcon({ category, size = 16, color }: P & { category: Category }) {
  const sw = 2;
  const common = { stroke: color, strokeWidth: sw, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {category === 'coupon' && (
        <>
          <Path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z" {...common} />
          <Path d="M14 7v10" {...common} strokeDasharray="2 2" />
        </>
      )}
      {category === 'event' && (
        <>
          <Rect x={3.5} y={5} width={17} height={15} rx={2} {...common} />
          <Path d="M3.5 10h17M8 3v4M16 3v4" {...common} />
        </>
      )}
      {category === 'place' && (
        <>
          <Path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z" {...common} />
          <Circle cx={12} cy={10} r={2.3} {...common} />
        </>
      )}
      {category === 'want' && (
        <>
          <Path d="M5 8h14l-1.2 12H6.2z" {...common} />
          <Path d="M9 8V6.5a3 3 0 0 1 6 0V8" {...common} />
        </>
      )}
      {category === 'recipe' && (
        <>
          <Path d="M4 11h16v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6z" {...common} />
          <Path d="M2 11h20M9 7c0-1 1-1.5 1-2.5M14 7c0-1 1-1.5 1-2.5" {...common} />
        </>
      )}
      {category === 'other' && (
        <>
          <Circle cx={6} cy={12} r={1.6} fill={color} />
          <Circle cx={12} cy={12} r={1.6} fill={color} />
          <Circle cx={18} cy={12} r={1.6} fill={color} />
        </>
      )}
    </Svg>
  );
}

export function BackIcon({ size = 20, color }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M15 5l-7 7 7 7" stroke={color} strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SearchIcon({ size = 20, color }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={11} cy={11} r={6.5} stroke={color} strokeWidth={2} fill="none" />
      <Path d="M16 16l4.5 4.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function CheckIcon({ size = 16, color }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M5 12.5l4.5 4.5L19 7.5" stroke={color} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function PencilIcon({ size = 18, color }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M4 20l1-4L16 5l3 3L8 19z M14 7l3 3" stroke={color} strokeWidth={1.8} fill="none" strokeLinejoin="round" />
    </Svg>
  );
}

export function MoreIcon({ size = 22, color }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={5} cy={12} r={2} fill={color} />
      <Circle cx={12} cy={12} r={2} fill={color} />
      <Circle cx={19} cy={12} r={2} fill={color} />
    </Svg>
  );
}

export function CloseIcon({ size = 18, color }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}
