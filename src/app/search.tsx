// E 探す画面
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { categoryFromQuery, search, SearchHit } from '../domain/selectors';
import { CATEGORY_LABEL, CATEGORY_ORDER } from '../domain/types';
import { useApp } from '../state/AppState';
import { GridCard } from '../ui/cards';
import { CloseIcon, SearchIcon } from '../ui/icons';
import { useToday } from '../ui/overlays';
import { CategoryTag, Screen, TopBar } from '../ui/parts';
import { colors, font, radius, TOUCH } from '../ui/theme';

function HitCard({ hit, todayKey, faded }: { hit: SearchHit; todayKey: string; faded?: boolean }) {
  return (
    <View style={s.hit}>
      <GridCard item={hit.item} todayKey={todayKey} faded={faded} onPress={() => router.push(`/item/${hit.item.id}`)} />
      {hit.snippet ? (
        <Text style={[s.snippet, faded && { opacity: 0.6 }]} numberOfLines={1}>
          {hit.snippet.before}
          <Text style={s.mark}>{hit.snippet.match}</Text>
          {hit.snippet.after}
        </Text>
      ) : null}
    </View>
  );
}

function HitGrid({ hits, todayKey, faded }: { hits: SearchHit[]; todayKey: string; faded?: boolean }) {
  const rows: SearchHit[][] = [];
  for (let i = 0; i < hits.length; i += 2) rows.push(hits.slice(i, i + 2));
  return (
    <View style={{ gap: 12 }}>
      {rows.map((r) => (
        <View key={r[0].item.id} style={s.row}>
          {r.map((h) => (
            <HitCard key={h.item.id} hit={h} todayKey={todayKey} faded={faded} />
          ))}
          {r.length === 1 ? <View style={{ flex: 1 }} /> : null}
        </View>
      ))}
    </View>
  );
}

export default function SearchScreen() {
  const { items } = useApp();
  const todayKey = useToday();
  const [q, setQ] = useState('');
  const result = useMemo(() => search(items, q), [items, q]);
  const total = result.active.length + result.done.length;
  const trimmed = q.trim();
  const isCat = categoryFromQuery(trimmed);

  return (
    <Screen>
      <TopBar />
      <View style={s.box}>
        <SearchIcon color={colors.sub} />
        <TextInput
          value={q}
          onChangeText={setQ}
          autoFocus
          placeholder="さがす（例：クーポン、カフェ）"
          placeholderTextColor="#8A8A8A"
          accessibilityLabel="さがす"
          style={s.input}
          returnKeyType="search"
        />
        {q ? (
          <Pressable accessibilityRole="button" accessibilityLabel="消す" onPress={() => setQ('')} style={s.clear}>
            <CloseIcon color={colors.sub} />
          </Pressable>
        ) : null}
      </View>

      {!trimmed ? (
        <View>
          <Text style={s.h}>種類から探す</Text>
          <View style={s.cats}>
            {CATEGORY_ORDER.map((c) => (
              <CategoryTag key={c} category={c} onPress={() => setQ(CATEGORY_LABEL[c])} />
            ))}
          </View>
        </View>
      ) : total === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyTitle}>『{trimmed}』は見つかりませんでした</Text>
          <Text style={s.emptyText}>ちがう言葉や、種類の名前（クーポン、予定など）でも探せます</Text>
        </View>
      ) : (
        <View>
          <Text style={s.count} accessibilityLiveRegion="polite">
            {total}件見つかりました{isCat ? `（種類：${CATEGORY_LABEL[isCat]}）` : ''}
          </Text>
          <HitGrid hits={result.active} todayKey={todayKey} />
          {result.done.length > 0 ? (
            <>
              <Text style={s.h}>済んだもの（{result.done.length}）</Text>
              <HitGrid hits={result.done} todayKey={todayKey} faded />
            </>
          ) : null}
        </View>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 52,
    borderRadius: radius.pill,
    paddingLeft: 16,
    paddingRight: 4,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  input: { flex: 1, fontSize: font.body + 1, color: colors.ink, paddingVertical: 12, minHeight: 48 },
  clear: { width: TOUCH, height: TOUCH, alignItems: 'center', justifyContent: 'center' },
  h: { fontSize: font.body, fontWeight: '700', color: colors.sub, marginTop: 24, marginBottom: 10 },
  cats: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  count: { fontSize: font.body, fontWeight: '700', color: colors.ink, marginTop: 20, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12 },
  hit: { flex: 1, gap: 4 },
  snippet: { fontSize: 13, color: colors.sub, paddingHorizontal: 4 },
  mark: { color: colors.ink, fontWeight: '800', backgroundColor: '#FFF1B8' },
  empty: { paddingVertical: 48, gap: 10, alignItems: 'center' },
  emptyTitle: { fontSize: font.title - 2, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  emptyText: { fontSize: font.body, color: colors.sub, textAlign: 'center', lineHeight: 24 },
});
