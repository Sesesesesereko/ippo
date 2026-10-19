// C 読み取り画面
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Category, CATEGORY_ORDER, Item, MAX_IMPORT } from '../domain/types';
import { BatchEntry, useApp } from '../state/AppState';
import { DueText, Progress, Shot } from '../ui/cards';
import { useToday } from '../ui/overlays';
import { CategoryTag, MainButton, Note, NoteText, OutlineButton, Screen, TopBar } from '../ui/parts';
import { colors, font, radius } from '../ui/theme';

const UNAVAILABLE = Platform.OS === 'web' ? 'このブラウザでは文字を読めません。種類と期限は自分で選べます' : '文字の読み取りは準備中です。種類と期限は自分で選べます';

function errorText(e: NonNullable<BatchEntry['error']>): string {
  if (e === 'heic') return 'この画像は開けませんでした。iPhoneの写真（HEIC形式）は、このブラウザでは開けません。スクショ（PNG）か、JPEGで保存した画像を選んでください';
  if (e === 'full') return 'いっぱいで入りません。いらないスクショを消してください';
  return 'この画像は開けませんでした';
}

function CategoryPicker({ item, onDone }: { item: Item; onDone?: () => void }) {
  const { setCategory } = useApp();
  return (
    <View style={s.picker}>
      {CATEGORY_ORDER.map((c: Category) => (
        <CategoryTag
          key={c}
          category={c}
          selected={item.category === c}
          onPress={() => {
            setCategory(item.id, c);
            onDone?.();
          }}
        />
      ))}
    </View>
  );
}

function EntryCard({ entry, item, todayKey }: { entry: BatchEntry; item?: Item; todayKey: string }) {
  const { retry } = useApp();
  const [picking, setPicking] = useState(false);
  if (entry.error) {
    return (
      <View style={[s.card, s.cardRow]}>
        <View style={[s.thumb, s.thumbEmpty]} />
        <View style={s.body}>
          <Text style={s.name} numberOfLines={1}>
            {entry.name}
          </Text>
          <Text style={s.msg}>{errorText(entry.error)}</Text>
        </View>
      </View>
    );
  }
  if (!item) {
    return (
      <View style={[s.card, s.cardRow]}>
        <View style={[s.thumb, s.thumbEmpty]} />
        <View style={s.body}>
          <Text style={s.msg}>{entry.itemId ? 'このスクショは消されました' : 'じゅんばんを待っています'}</Text>
          {!entry.itemId ? <Progress /> : null}
        </View>
      </View>
    );
  }
  const finished = item.status === 'ready' || item.status === 'failed';
  return (
    <View style={s.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${item.title} をくわしく見る`}
        onPress={() => router.push(`/item/${item.id}`)}
        style={({ pressed }) => [s.cardRow, pressed && { opacity: 0.7 }]}
      >
        <Shot item={item} style={s.thumb} />
        <View style={s.body}>
          {item.status === 'waiting' ? <Text style={s.msg}>じゅんばんを待っています</Text> : null}
          {item.status === 'reading' ? (
            <>
              <Text style={s.msg}>読み取り中…</Text>
              <Progress />
            </>
          ) : null}
          {item.status === 'stopped' ? <Text style={s.msg}>読み取りが止まりました</Text> : null}
          {finished ? (
            <>
              <Text style={s.title} numberOfLines={2}>
                {item.title}
              </Text>
              <DueText item={item} todayKey={todayKey} />
              {item.status === 'failed' ? <Text style={s.msg}>{item.failReason === 'unavailable' ? UNAVAILABLE : '文字が読めませんでした。種類は自分で選べます'}</Text> : null}
            </>
          ) : null}
        </View>
      </Pressable>
      {finished ? (
        <View style={s.catArea}>
          {item.status === 'failed' || picking ? (
            <CategoryPicker item={item} onDone={() => setPicking(false)} />
          ) : (
            <View style={s.catRow}>
              <CategoryTag category={item.category} onPress={() => setPicking(true)} />
              <Text style={s.fix}>ちがうときは押して直す</Text>
            </View>
          )}
        </View>
      ) : null}
      {item.status === 'stopped' ? <OutlineButton label="もう一度読む" onPress={() => retry(item.id)} style={{ marginTop: 10 }} /> : null}
    </View>
  );
}

export default function ImportScreen() {
  const { batch, items, settings } = useApp();
  const todayKey = useToday();
  const goHome = () => router.dismissTo('/');

  const entries = batch?.entries ?? [];
  const byId = new Map(items.map((i) => [i.id, i]));
  const total = entries.length;
  const finished = entries.filter((e) => {
    if (e.error) return true;
    const it = e.itemId ? byId.get(e.itemId) : undefined;
    return it ? it.status === 'ready' || it.status === 'failed' : !!e.itemId;
  }).length;

  return (
    <Screen bottom={<MainButton label="できた" onPress={goHome} />}>
      <TopBar title="読み取り" onBack={goHome} />
      {total === 0 ? (
        <Text style={s.lead}>読み取るスクショはありません</Text>
      ) : (
        <>
          <Text style={s.lead} accessibilityLiveRegion="polite">
            {total}枚中 {finished}枚できた
          </Text>
          <View style={s.track}>
            <View style={[s.trackFill, { width: `${total ? (finished / total) * 100 : 0}%` }]} />
          </View>
          <Text style={s.sub}>1枚 10秒ほどかかります。ほかの画面に行っても続きます</Text>
          {!settings.ocrReady && Platform.OS === 'web' ? <Text style={s.sub}>はじめてだけ、準備に少し時間がかかります</Text> : null}
          {batch?.overLimit ? (
            <Note style={{ marginTop: 12 }}>
              <NoteText>一度に入れられるのは{MAX_IMPORT}枚までです。はじめの{MAX_IMPORT}枚を入れました</NoteText>
            </Note>
          ) : null}
          {batch && batch.fullCount > 0 ? (
            <Note style={{ marginTop: 12 }}>
              <NoteText>{batch.fullCount}枚入りませんでした</NoteText>
            </Note>
          ) : null}
          <View style={s.list}>
            {entries.map((e) => (
              <EntryCard key={e.key} entry={e} item={e.itemId ? byId.get(e.itemId) : undefined} todayKey={todayKey} />
            ))}
          </View>
        </>
      )}
    </Screen>
  );
}

const s = StyleSheet.create({
  lead: { fontSize: font.title, fontWeight: '700', color: colors.ink, marginTop: 8 },
  track: { height: 8, borderRadius: 4, backgroundColor: '#E2E0DC', marginTop: 10, overflow: 'hidden' },
  trackFill: { height: 8, backgroundColor: colors.primary, borderRadius: 4 },
  sub: { fontSize: font.small, color: colors.sub, marginTop: 8, lineHeight: 21 },
  list: { gap: 12, marginTop: 16 },
  card: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, padding: 12 },
  cardRow: { flexDirection: 'row', gap: 12 },
  thumb: { width: 72, height: 96, borderRadius: 8 },
  thumbEmpty: { backgroundColor: '#ECEAE6' },
  body: { flex: 1, gap: 6, justifyContent: 'center' },
  name: { fontSize: font.small, color: colors.sub },
  msg: { fontSize: font.small + 1, color: colors.ink, lineHeight: 22 },
  title: { fontSize: font.body, fontWeight: '700', color: colors.ink, lineHeight: 22 },
  catArea: { marginTop: 10 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  fix: { fontSize: font.small, color: colors.sub },
  picker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
