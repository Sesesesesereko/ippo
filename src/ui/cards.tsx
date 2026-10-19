// スクショのカードと画像の表示。
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { dueLabel, formatMDW, diffDays } from '../domain/dates';
import { Item } from '../domain/types';
import { getImageUri } from '../services/images';
import { CategoryIcon } from './icons';
import { CategoryTag, StateTag } from './parts';
import { CATEGORY_COLOR, colors, font, radius } from './theme';

export function useImageUri(item: Item | undefined): string | null {
  const [uri, setUri] = useState<string | null>(null);
  const id = item?.id;
  const has = item?.hasImage;
  useEffect(() => {
    let alive = true;
    if (!id || !has) {
      setUri(null);
      return;
    }
    getImageUri(id).then((u) => alive && setUri(u));
    return () => {
      alive = false;
    };
  }, [id, has]);
  return uri;
}

/** 画像（見本は文字入りの「スクショ風」の絵を描く） */
export function Shot({ item, style, contain }: { item: Item; style?: ViewStyle; contain?: boolean }) {
  const uri = useImageUri(item);
  if (item.isSample || !item.hasImage) {
    const c = CATEGORY_COLOR[item.category];
    return (
      <View style={[s.sample, { backgroundColor: c.bg }, style]}>
        {item.ocrText.split('\n').map((l, i) => (
          <Text key={i} style={[s.sampleLine, i === 0 && { fontWeight: '700', color: c.fg }]} numberOfLines={1}>
            {l}
          </Text>
        ))}
      </View>
    );
  }
  return (
    <View style={[s.imgBox, style]}>
      {uri ? <Image source={{ uri }} style={StyleSheet.absoluteFill} resizeMode={contain ? 'contain' : 'cover'} accessibilityIgnoresInvertColors /> : null}
    </View>
  );
}

/** 動く帯（読み取り中） */
export function Progress({ active = true }: { active?: boolean }) {
  const x = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(Animated.timing(x, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: false }));
    loop.start();
    return () => loop.stop();
  }, [active, x]);
  const left = x.interpolate({ inputRange: [0, 1], outputRange: ['-40%', '100%'] });
  return (
    <View style={s.bar}>
      <Animated.View style={[s.barFill, { left }]} />
    </View>
  );
}

export function statusWord(item: Item): string | null {
  switch (item.status) {
    case 'waiting':
      return 'じゅんばんを待っています';
    case 'reading':
      return '読み取り中…';
    case 'stopped':
      return '読み取りが止まりました';
    default:
      return null;
  }
}

/** 期限の表示「10/31（金）まで」＋ 期限切れ */
export function DueText({ item, todayKey, style }: { item: Item; todayKey: string; style?: object }) {
  if (!item.dueDate) return null;
  const n = diffDays(todayKey, item.dueDate);
  if (n < 0) return <Text style={[s.due, { color: colors.sub }, style]}>期限切れ</Text>;
  const isEvent = item.category === 'event';
  return (
    <Text style={[s.due, n <= 1 && { color: colors.urgent }, style]}>
      {formatMDW(item.dueDate)}
      {isEvent ? '' : 'まで'}
    </Text>
  );
}

/** 一覧の小さな画像カード（2列） */
export function GridCard({ item, todayKey, onPress, faded }: { item: Item; todayKey: string; onPress: () => void; faded?: boolean }) {
  const word = statusWord(item);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.title}
      onPress={onPress}
      style={({ pressed }) => [s.grid, faded && { opacity: 0.55 }, pressed && { opacity: 0.7 }]}
      testID={`card-${item.id}`}
    >
      <View>
        <Shot item={item} style={s.gridShot} />
        {item.isSample ? (
          <View style={s.sampleBadge}>
            <StateTag label="見本" dashed />
          </View>
        ) : null}
        {word ? (
          <View style={s.readingOverlay}>
            <Text style={s.readingText}>{word}</Text>
            {item.status === 'reading' || item.status === 'waiting' ? <Progress /> : null}
          </View>
        ) : null}
      </View>
      <View style={s.gridBody}>
        <CategoryTag category={item.category} size="s" />
        <Text style={s.gridTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <DueText item={item} todayKey={todayKey} />
      </View>
    </Pressable>
  );
}

/** 横長のカード（期限が近いもの） */
export function RowCard({ item, todayKey, onPress }: { item: Item; todayKey: string; onPress: () => void }) {
  const c = CATEGORY_COLOR[item.category];
  const label = item.dueDate ? dueLabel(item.dueDate, todayKey, item.category === 'event') : '';
  const urgent = item.dueDate ? diffDays(todayKey, item.dueDate) <= 1 : false;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${item.title} ${label}`} onPress={onPress} style={({ pressed }) => [s.row, pressed && { opacity: 0.7 }]}>
      <View style={[s.rowIcon, { backgroundColor: c.bg }]}>
        <CategoryIcon category={item.category} color={c.fg} size={20} />
      </View>
      <Text style={s.rowTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={[s.rowDue, urgent && { color: colors.urgent }]}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  sample: { padding: 10, gap: 4, overflow: 'hidden', justifyContent: 'center' },
  sampleLine: { fontSize: 12, color: '#3A3A3A' },
  imgBox: { backgroundColor: '#ECEAE6', overflow: 'hidden' },
  bar: { height: 6, borderRadius: 3, backgroundColor: '#E2E0DC', overflow: 'hidden', width: '100%' },
  barFill: { position: 'absolute', top: 0, bottom: 0, width: '40%', borderRadius: 3, backgroundColor: '#7B86C4' },
  due: { fontSize: font.small, color: colors.ink, fontWeight: '600' },
  grid: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
  },
  gridShot: { height: 120, width: '100%' },
  sampleBadge: { position: 'absolute', top: 6, right: 6 },
  readingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 8,
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  readingText: { fontSize: 13, color: colors.ink, fontWeight: '600' },
  gridBody: { padding: 10, gap: 6 },
  gridTitle: { fontSize: 15, color: colors.ink, fontWeight: '600', lineHeight: 21 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 60,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  rowIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  rowTitle: { flex: 1, fontSize: font.body, color: colors.ink, fontWeight: '600' },
  rowDue: { fontSize: font.body, color: colors.ink, fontWeight: '700' },
});
