import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppState } from '../state/AppState';
import { useNav } from '../navigation/Nav';
import { Btn, Card, Field, Label, Screen, StorageNotice } from '../ui/parts';
import { colors, font, radius } from '../ui/theme';
import { useNow } from '../ui/useNow';
import { currentStep, laterTasks, routinesDoneToday } from '../domain/selectors';
import { formatJapaneseDate, formatRemaining, minutesUntil, normalizeTime, visitsThisWeek } from '../domain/date';

export function HomeScreen() {
  const { data, dispatch } = useAppState();
  const nav = useNav();
  const now = useNow(30_000);
  const [draft, setDraft] = useState('');
  const [added, setAdded] = useState('');

  const step = currentStep(data);
  const later = laterTasks(data);
  const doneIds = routinesDoneToday(data, now);
  const visits = visitsThisWeek(data.visitDays, now);

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    dispatch({ type: 'ADD_TASK', title: v });
    setDraft('');
    setAdded(v);
  };

  return (
    <Screen>
      <StorageNotice />

      <View style={styles.top}>
        <View style={{ gap: 2 }}>
          <Text style={styles.date}>{formatJapaneseDate(now)}</Text>
          <Text style={styles.hello}>おかえりなさい</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Pressable onPress={() => nav.push({ name: 'guide' })} accessibilityRole="button" style={styles.editHit}>
            <Text style={styles.smallLink}>使い方</Text>
          </Pressable>
          <View style={styles.pill}>
            <Text style={styles.pillText}>今週 {visits}回 戻ってきた</Text>
          </View>
        </View>
      </View>

      <DepartureCard now={now} />

      <View style={{ gap: 8 }}>
        <View style={styles.rowBetween}>
          <Label>毎日のこと</Label>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={styles.smallLink}>今日 {doneIds.length}つ できた</Text>
            <Pressable onPress={() => nav.push({ name: 'routines' })} accessibilityRole="button" style={styles.editHit}>
              <Text style={styles.smallLink}>編集</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.chips}>
          {data.routines.length === 0 && <Text style={styles.muted}>「編集」から日課を追加できます</Text>}
          {data.routines.map((r) => {
            const on = doneIds.includes(r.id);
            return (
              <Pressable
                key={r.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on }}
                onPress={() => dispatch({ type: 'TOGGLE_ROUTINE', routineId: r.id })}
                style={[styles.chip, on ? styles.chipOn : styles.chipOff]}
              >
                <Text style={{ fontSize: 14, color: on ? colors.link : colors.ink }}>
                  {on ? '✓ ' : ''}
                  {r.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.now}>
        <Text style={styles.nowEyebrow}>いま やる ひとつ</Text>
        {step ? (
          <>
            <Text style={styles.nowTitle}>{step.label}</Text>
            {step.total > 1 && (
              <Text style={styles.nowSub}>
                {step.task.title} の {step.index + 1}歩目 / 全{step.total}歩
              </Text>
            )}
            <Btn kind="accent" label={`この一歩を、${step.minutes}分で`} onPress={() => nav.push({ name: 'focus' })} />
            <Pressable onPress={() => nav.push({ name: 'taskEdit', taskId: step.task.id })} style={styles.center}>
              <Text style={styles.nowLink}>一歩が大きすぎる？ もっと細かくする</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Text style={styles.nowTitle}>まずは、やることを1つ</Text>
            <Text style={styles.nowSub}>すぐ下の欄に、ひとことで入れてください。ここに「いま やる ひとつ」として出てきます。</Text>
            <Btn kind="outlineDark" label="見本を入れて試す" onPress={() => dispatch({ type: 'LOAD_SAMPLE' })} />
          </>
        )}
      </View>

      <View style={{ gap: 8 }}>
        <Label>やることを追加（期限はあとで決めてOK）</Label>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Field
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={add}
            placeholder="例：体操服を洗濯に出す"
            returnKeyType="done"
            style={{ flex: 1, minWidth: 0 }}
            accessibilityLabel="やることを追加"
          />
          <Btn label="追加" onPress={add} style={{ minWidth: 72, minHeight: 48, backgroundColor: colors.link, borderColor: colors.link }} />
        </View>
        {added !== '' && <Text style={styles.smallLink}>「{added}」を入れました</Text>}
      </View>

      <Pressable onPress={() => nav.push({ name: 'tasks' })} accessibilityRole="button" style={styles.laterRow}>
        <Text style={{ fontSize: 15, color: colors.ink }}>
          あとでやること <Text style={{ color: colors.sub }}>{later.length}件</Text>
        </Text>
        <Text style={styles.smallLink}>一覧・並べ替え ›</Text>
      </Pressable>
    </Screen>
  );
}

function DepartureCard({ now }: { now: Date }) {
  const { data, dispatch } = useAppState();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(data.departure.time ?? '');
  const [error, setError] = useState('');
  const time = data.departure.time;

  const save = () => {
    if (text.trim() === '') {
      dispatch({ type: 'SET_DEPARTURE', time: null });
      setEditing(false);
      setError('');
      return;
    }
    const t = normalizeTime(text);
    if (!t) {
      setError('「8:15」のように入れてください');
      return;
    }
    dispatch({ type: 'SET_DEPARTURE', time: t });
    setText(t);
    setEditing(false);
    setError('');
  };

  if (!time && !editing) {
    return (
      <Pressable onPress={() => setEditing(true)} accessibilityRole="button" style={styles.departureMini}>
        <Text style={{ fontSize: 14, color: colors.ink, flex: 1 }}>出かける時刻を入れると、残り時間が見えます</Text>
        <Text style={styles.smallLink}>入れる ›</Text>
      </Pressable>
    );
  }

  if (!time || editing) {
    return (
      <Card>
        <Label>出発時刻（カレンダー連携は今後。今は手で入れます）</Label>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Field
            value={text}
            onChangeText={setText}
            onSubmitEditing={save}
            placeholder="例：8:15"
            keyboardType="numbers-and-punctuation"
            style={{ flex: 1, minWidth: 0 }}
            accessibilityLabel="出発時刻"
          />
          <Btn label="決める" onPress={save} style={{ minHeight: 48, minWidth: 80 }} />
        </View>
        {error !== '' && <Text style={{ color: colors.danger, fontSize: 13 }}>{error}</Text>}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          {time && <Btn small kind="ghost" label="時刻を消す" onPress={() => { dispatch({ type: 'SET_DEPARTURE', time: null }); setText(''); setEditing(false); }} />}
          <Btn small kind="ghost" label="やめる" onPress={() => { setEditing(false); setError(''); }} />
        </View>
      </Card>
    );
  }

  const mins = minutesUntil(time, now);
  const passed = mins < 0;
  const ratio = passed ? 0 : Math.min(1, mins / 120); // 2時間を満タンとして表示
  return (
    <Card>
      <View style={styles.rowBetween}>
        <Label>出発まで</Label>
        <Pressable onPress={() => setEditing(true)} accessibilityRole="button" style={styles.editHit}>
          <Text style={styles.smallLink}>{time} 家を出る ・ 変更</Text>
        </Pressable>
      </View>
      {passed ? (
        <Text style={[styles.bigTime, { fontSize: 22 }]}>出発時刻を過ぎました</Text>
      ) : (
        <Text style={styles.bigTime}>
          あと {formatRemaining(mins).num}
          <Text style={{ fontSize: 20 }}> {formatRemaining(mins).unit}</Text>
          {formatRemaining(mins).rest && <Text style={{ fontSize: 24 }}> {formatRemaining(mins).rest}</Text>}
        </Text>
      )}
      <View style={styles.barBg}>
        <View style={[styles.barFg, { width: `${Math.round(ratio * 100)}%` }]} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 8, flexWrap: 'wrap' },
  date: { fontSize: 13, color: colors.sub },
  hello: { fontSize: 24, fontWeight: '700', color: colors.ink },
  pill: { backgroundColor: colors.chip, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  pillText: { fontSize: 12, color: colors.link },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  smallLink: { fontSize: 13, color: colors.link },
  editHit: { minHeight: 32, justifyContent: 'center' },
  departureMini: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: radius.l,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.line,
  },
  muted: { fontSize: 13, color: colors.sub },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { minHeight: 40, paddingHorizontal: 14, borderRadius: 999, justifyContent: 'center', borderWidth: 1 },
  chipOn: { backgroundColor: colors.chip, borderColor: colors.chip },
  chipOff: { backgroundColor: colors.surface, borderColor: colors.line },
  now: { backgroundColor: colors.deep, borderRadius: radius.xl, padding: 20, gap: 12 },
  nowEyebrow: { fontSize: 12, letterSpacing: 1, color: colors.deepSub },
  nowTitle: { fontSize: font.big, fontWeight: '700', color: '#F2F6F5', lineHeight: 36 },
  nowSub: { fontSize: 13, color: colors.deepSub, lineHeight: 20 },
  nowLink: { fontSize: 13, color: '#CFE1E5', paddingVertical: 6 },
  center: { alignItems: 'center' },
  laterRow: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 52,
    borderTopWidth: 1,
    borderTopColor: '#D5DDD9',
    paddingTop: 8,
  },
  bigTime: { fontSize: 40, fontWeight: '700', color: colors.time },
  barBg: { height: 12, backgroundColor: '#E3E9E6', borderRadius: 999, overflow: 'hidden' },
  barFg: { height: 12, backgroundColor: colors.time, borderRadius: 999 },
});
