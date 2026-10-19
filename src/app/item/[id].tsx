// D くわしく画面
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { diffDays, dueLabel, formatMDW } from '../../domain/dates';
import { CATEGORY_ORDER, Item } from '../../domain/types';
import { useApp } from '../../state/AppState';
import { Shot, statusWord } from '../../ui/cards';
import { DatePick } from '../../ui/DatePick';
import { PencilIcon } from '../../ui/icons';
import { ConfirmSheet, useToday } from '../../ui/overlays';
import { CategoryTag, Chip, goBack, MainButton, OutlineButton, Screen, StateTag, TextButton, TopBar } from '../../ui/parts';
import { colors, font, radius } from '../../ui/theme';

function dueHeading(item: Item): string {
  if (item.category === 'coupon') return '使える期限';
  if (item.category === 'event') return '日にち';
  return '期限';
}

export default function ItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { items, setTitle, setCategory, setDue, setDone, remove, showToast, retry } = useApp();
  const todayKey = useToday();
  const item = items.find((i) => i.id === id);
  const [title, setTitleText] = useState(item?.title ?? '');
  const [saved, setSaved] = useState(false);
  const [big, setBig] = useState(false);
  const [showText, setShowText] = useState(false);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (item) setTitleText(item.title);
    // タイトルが外で変わったとき（読み取りが終わった等）だけ入れ直す
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.title]);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 2000);
    return () => clearTimeout(t);
  }, [saved]);

  if (!item) {
    return (
      <Screen>
        <TopBar />
        <Text style={s.p}>このスクショは見つかりませんでした</Text>
      </Screen>
    );
  }

  const commitTitle = () => {
    if (title.trim() === item.title) return;
    setTitle(item.id, title);
    setSaved(true);
  };

  const isCoupon = item.category === 'coupon';
  const mainLabel = item.done ? 'まだにもどす' : isCoupon ? '使った' : '済んだ';
  const onMain = () => {
    if (item.done) {
      setDone(item.id, false);
      showToast('まだにもどしました');
      goBack();
      return;
    }
    setDone(item.id, true);
    const id0 = item.id;
    showToast(isCoupon ? '使ったにしました' : '済んだにしました', { undo: () => setDone(id0, false), ms: 5000 });
    router.dismissTo('/');
  };

  const word = statusWord(item);
  const reading = item.status === 'waiting' || item.status === 'reading';
  const expired = item.dueDate ? diffDays(todayKey, item.dueDate) < 0 : false;
  const candidates = item.dueCandidates;
  const dueChoices = item.dueDate && !candidates.includes(item.dueDate) ? [...candidates, item.dueDate] : candidates;
  const ratio = item.imageWidth && item.imageHeight ? item.imageHeight / item.imageWidth : 0.6;

  return (
    <Screen bottom={<MainButton label={mainLabel} onPress={onMain} />}>
      <TopBar />
      <Pressable accessibilityRole="button" accessibilityLabel={big ? '画像を戻す' : '画像を大きく見る'} onPress={() => setBig((v) => !v)}>
        <Shot item={item} contain style={{ ...s.image, height: big ? Math.min(900, 358 * ratio) : 220 }} />
      </Pressable>

      {reading ? <Text style={s.notice}>読み取り中です。終わると種類と期限が出ます</Text> : null}
      {item.status === 'stopped' ? (
        <View style={{ marginTop: 10, gap: 8 }}>
          <Text style={s.notice}>{word}</Text>
          <OutlineButton label="もう一度読む" onPress={() => retry(item.id)} />
        </View>
      ) : null}

      <View style={s.tags}>
        {item.isSample ? <StateTag label="見本" dashed /> : null}
        {item.done ? <StateTag label={isCoupon ? '使った' : '済んだ'} /> : null}
        {expired ? <StateTag label="期限切れ" /> : null}
      </View>

      <View style={s.titleRow}>
        <TextInput
          value={title}
          onChangeText={setTitleText}
          onBlur={commitTitle}
          onSubmitEditing={commitTitle}
          accessibilityLabel="タイトル"
          style={s.titleInput}
          returnKeyType="done"
          multiline={false}
        />
        <PencilIcon color={colors.sub} />
      </View>

      <Text style={s.h}>種類</Text>
      <View style={s.catGrid}>
        {CATEGORY_ORDER.map((c) => (
          <View key={c} style={s.catCell}>
            <CategoryTag
              fill
              category={c}
              selected={item.category === c}
              onPress={() => {
                if (item.category !== c) {
                  setCategory(item.id, c);
                  setSaved(true);
                }
              }}
            />
          </View>
        ))}
      </View>
      <Text style={[s.saved, !saved && { opacity: 0 }]} accessibilityLiveRegion="polite">
        {saved ? '保存しました' : ' '}
      </Text>

      <Text style={s.h}>{dueHeading(item)}</Text>
      {dueChoices.length === 0 ? <Text style={s.sub}>日付は見つかりませんでした</Text> : null}
      <View style={s.chips}>
        {dueChoices.map((k) => (
          <Chip
            key={k}
            label={formatMDW(k)}
            selected={item.dueDate === k}
            onPress={() => {
              setDue(item.id, k);
              setSaved(true);
            }}
          />
        ))}
        <DatePick
          value={item.dueDate}
          onPick={(k) => {
            setDue(item.id, k);
            setSaved(true);
          }}
        />
        <Chip
          label="なし"
          selected={!item.dueDate}
          onPress={() => {
            setDue(item.id, null);
            setSaved(true);
          }}
        />
      </View>
      {item.dueDate ? <Text style={[s.dueLeft, diffDays(todayKey, item.dueDate) <= 1 && { color: colors.urgent }]}>{dueLabel(item.dueDate, todayKey, item.category === 'event')}</Text> : null}

      <View style={s.textBox}>
        <TextButton label={showText ? '読み取った文字をとじる' : '読み取った文字を見る'} onPress={() => setShowText((v) => !v)} style={{ alignSelf: 'flex-start' }} />
        {showText ? (
          <View style={s.ocr}>
            <Text style={s.sub}>仮版なので、まちがいがあります</Text>
            <Text style={s.ocrText} selectable>
              {item.ocrText || '（読み取った文字はありません）'}
            </Text>
          </View>
        ) : null}
      </View>

      <TextButton label="このスクショを消す" color={colors.danger} onPress={() => setConfirm(true)} style={{ alignSelf: 'flex-start', marginTop: 8 }} />

      <ConfirmSheet
        visible={confirm}
        title="消しますか？"
        body={`もとに戻せません。${item.isSample ? '' : '写真アプリの元の画像は消えません'}`}
        okLabel="消す"
        onCancel={() => setConfirm(false)}
        onOk={() => {
          setConfirm(false);
          void remove(item.id);
          showToast('消しました');
          router.dismissTo('/');
        }}
      />
    </Screen>
  );
}

const s = StyleSheet.create({
  p: { fontSize: font.body, color: colors.ink, marginTop: 24 },
  image: { width: '100%', borderRadius: radius.card, backgroundColor: '#ECEAE6' },
  notice: { fontSize: font.small + 1, color: colors.ink, backgroundColor: colors.noteBg, padding: 10, borderRadius: 10, marginTop: 10 },
  tags: { flexDirection: 'row', gap: 6, marginTop: 12, minHeight: 4 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.lineStrong,
    marginTop: 8,
  },
  titleInput: { flex: 1, fontSize: font.title, fontWeight: '700', color: colors.ink, paddingVertical: 10, minHeight: 48 },
  h: { fontSize: font.body, fontWeight: '700', color: colors.sub, marginTop: 20, marginBottom: 10 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 8 },
  catCell: { width: '33.33%', paddingRight: 6 },
  saved: { fontSize: font.small, color: '#2F855A', marginTop: 6, fontWeight: '600' },
  sub: { fontSize: font.small, color: colors.sub, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dueLeft: { fontSize: font.body, color: colors.ink, fontWeight: '700', marginTop: 10 },
  textBox: { marginTop: 20 },
  ocr: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, padding: 12 },
  ocrText: { fontSize: font.small + 1, color: colors.ink, lineHeight: 22 },
});
