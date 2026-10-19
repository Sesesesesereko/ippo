// B ホーム
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect, router, useIsFocused } from 'expo-router';
import { activeItems, categoryCounts, doneItems, upcoming } from '../domain/selectors';
import { Category, CATEGORY_LABEL, CATEGORY_ORDER, Item } from '../domain/types';
import { useApp } from '../state/AppState';
import { GridCard, RowCard } from '../ui/cards';
import { MoreIcon, SearchIcon } from '../ui/icons';
import { ConfirmSheet, ProvisionalSheet, useToday } from '../ui/overlays';
import { CategoryTag, Chip, MainButton, PLACE_WORD, ProvisionalBadge, Screen, SectionTitle, TextButton } from '../ui/parts';
import { colors, font, radius, TOUCH } from '../ui/theme';
import { useAddScreenshots } from '../ui/useAddScreenshots';

function Grid({ items, todayKey, faded }: { items: Item[]; todayKey: string; faded?: boolean }) {
  const rows: Item[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return (
    <View style={{ gap: 12 }}>
      {rows.map((r) => (
        <View key={r[0].id} style={s.gridRow}>
          {r.map((it) => (
            <GridCard key={it.id} item={it} todayKey={todayKey} faded={faded} onPress={() => router.push(`/item/${it.id}`)} />
          ))}
          {r.length === 1 ? <View style={{ flex: 1 }} /> : null}
        </View>
      ))}
    </View>
  );
}

export default function Home() {
  const { items, settings, patchSettings, addSamples, removeSamples } = useApp();
  const todayKey = useToday();
  const add = useAddScreenshots();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [provOpen, setProvOpen] = useState(false);
  const focused = useIsFocused();

  const up = useMemo(() => upcoming(items, todayKey), [items, todayKey]);
  const counts = useMemo(() => categoryCounts(items), [items]);
  const list = useMemo(() => activeItems(items, filter), [items, filter]);
  const done = useMemo(() => doneItems(items), [items]);
  const hasSample = items.some((i) => i.isSample);
  const hasOwn = items.some((i) => !i.isSample);
  // 画面が奥にあるとき（読み取り画面の下など）は窓を出さない
  const askRemove = focused && hasSample && hasOwn && !settings.askedRemoveSample;

  if (!settings.seenWelcome) return <Redirect href="/welcome" />;

  const shownUp = showAllUpcoming ? up : up.slice(0, 3);

  return (
    <Screen bottom={<MainButton label="＋ スクショを追加" onPress={add} />}>
      <View style={s.top}>
        <View style={s.brand}>
          <Text style={s.appName} accessibilityRole="header">
            スクショ係
          </Text>
          <ProvisionalBadge onPress={() => setProvOpen(true)} />
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="メニュー" onPress={() => router.push('/menu')} style={({ pressed }) => [s.more, pressed && { opacity: 0.6 }]}>
          <MoreIcon color={colors.ink} />
        </Pressable>
      </View>

      {hasSample && !settings.seenHint ? (
        <View style={s.hint}>
          <Text style={s.hintText}>カードを押すと、種類や期限を直せます</Text>
          <TextButton label="わかった" onPress={() => patchSettings({ seenHint: true })} />
        </View>
      ) : null}

      {items.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyTitle}>まだスクショがありません</Text>
          <Text style={s.emptyText}>クーポンや予定のスクショを入れると、種類ごとに分けます</Text>
          <TextButton label="見本で試す" onPress={addSamples} />
        </View>
      ) : (
        <>
          <Pressable accessibilityRole="search" accessibilityLabel="さがす" onPress={() => router.push('/search')} style={({ pressed }) => [s.search, pressed && { opacity: 0.7 }]}>
            <SearchIcon color={colors.sub} />
            <Text style={s.searchText}>さがす（例：クーポン、カフェ）</Text>
          </Pressable>

          {up.length > 0 ? (
            <View>
              <SectionTitle>期限が近いもの</SectionTitle>
              <View style={{ gap: 8 }}>
                {shownUp.map((it) => (
                  <RowCard key={it.id} item={it} todayKey={todayKey} onPress={() => router.push(`/item/${it.id}`)} />
                ))}
              </View>
              {up.length > 3 && !showAllUpcoming ? <TextButton label={`ほか${up.length - 3}件を見る`} onPress={() => setShowAllUpcoming(true)} style={{ alignSelf: 'flex-start' }} /> : null}
            </View>
          ) : null}

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll} contentContainerStyle={s.filters}>
            <Chip label={`すべて ${counts.all}`} selected={filter === 'all'} onPress={() => setFilter('all')} />
            {CATEGORY_ORDER.map((c) => (
              <CategoryTag key={c} category={c} count={counts[c]} selected={filter === c} onPress={() => setFilter(c)} />
            ))}
          </ScrollView>

          {list.length === 0 ? (
            <Text style={s.none}>{filter === 'all' ? 'まだのものはありません' : `${CATEGORY_LABEL[filter]}はまだありません`}</Text>
          ) : (
            <Grid items={list} todayKey={todayKey} />
          )}

          {done.length > 0 ? (
            <View style={{ marginTop: 20 }}>
              <Pressable accessibilityRole="button" accessibilityState={{ expanded: showDone }} onPress={() => setShowDone((v) => !v)} style={({ pressed }) => [s.doneHead, pressed && { opacity: 0.6 }]}>
                <Text style={s.doneHeadText}>
                  {showDone ? '▾' : '▸'} 済んだもの（{done.length}）
                </Text>
              </Pressable>
              {showDone ? <Grid items={done} todayKey={todayKey} faded /> : null}
            </View>
          ) : null}
        </>
      )}

      <Text style={s.footer}>データは{PLACE_WORD}の中だけにあります</Text>

      <ProvisionalSheet visible={provOpen && focused} onClose={() => setProvOpen(false)} />
      <ConfirmSheet
        visible={askRemove}
        title="見本を消しますか？"
        body="のこしても、あとでメニューから消せます"
        okLabel="消す"
        cancelLabel="のこす"
        onOk={removeSamples}
        onCancel={() => patchSettings({ askedRemoveSample: true })}
      />
    </Screen>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 56 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  appName: { fontSize: font.title + 2, fontWeight: '800', color: colors.ink },
  more: { width: TOUCH, height: TOUCH, alignItems: 'center', justifyContent: 'center', marginRight: -8 },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF0FA',
    borderRadius: radius.card,
    paddingLeft: 14,
    marginBottom: 12,
  },
  hintText: { flex: 1, fontSize: font.small, color: colors.ink, paddingVertical: 8 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 48,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  searchText: { color: colors.sub, fontSize: font.body },
  filterScroll: { marginTop: 20, marginHorizontal: -16 },
  filters: { gap: 8, paddingHorizontal: 16, paddingBottom: 12 },
  gridRow: { flexDirection: 'row', gap: 12 },
  none: { fontSize: font.body, color: colors.sub, paddingVertical: 24, textAlign: 'center' },
  doneHead: { minHeight: TOUCH, justifyContent: 'center', marginBottom: 8 },
  doneHeadText: { fontSize: font.body, color: colors.ink, fontWeight: '700' },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyTitle: { fontSize: font.title, fontWeight: '700', color: colors.ink },
  emptyText: { fontSize: font.body, color: colors.sub, textAlign: 'center', lineHeight: 24 },
  footer: { marginTop: 28, fontSize: font.small, color: colors.sub, textAlign: 'center' },
});
