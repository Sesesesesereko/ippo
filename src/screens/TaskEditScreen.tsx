import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppState } from '../state/AppState';
import { useNav } from '../navigation/Nav';
import { Btn, Card, Field, Header, IconBtn, Label, Screen } from '../ui/parts';
import { colors, radius } from '../ui/theme';
import { Granularity } from '../domain/types';
import { breakdownProvider } from '../services/breakdown';

const LEVELS: { key: Granularity; label: string }[] = [
  { key: 'rough', label: 'ざっくり' },
  { key: 'normal', label: 'ふつう' },
  { key: 'fine', label: 'こまかく' },
];

export function TaskEditScreen({ taskId }: { taskId: string }) {
  const { data, dispatch } = useAppState();
  const nav = useNav();
  const task = data.tasks.find((t) => t.id === taskId);
  const [level, setLevel] = useState<Granularity>('normal');
  const [busy, setBusy] = useState(false);
  const [confirmReplace, setConfirmReplace] = useState(false);

  if (!task) {
    return (
      <Screen>
        <Header title="小さく分ける" />
        <Text style={styles.hint}>このやることは見つかりませんでした。消された可能性があります。</Text>
        <Btn label="ホームに戻る" onPress={nav.home} />
      </Screen>
    );
  }

  const runBreakdown = async () => {
    setBusy(true);
    setConfirmReplace(false);
    try {
      const steps = await breakdownProvider.breakDown({ title: task.title, granularity: level });
      dispatch({ type: 'SET_STEPS', id: task.id, steps });
    } finally {
      setBusy(false);
    }
  };

  const onBreakdownPress = () => {
    if (task.steps.length > 0 && !confirmReplace) {
      setConfirmReplace(true);
      return;
    }
    runBreakdown();
  };

  const start = () => {
    dispatch({ type: 'MAKE_CURRENT', id: task.id });
    nav.push({ name: 'focus' });
  };

  return (
    <Screen>
      <Header title="小さく分ける" />

      <View style={{ gap: 8 }}>
        <Label>やること</Label>
        <Field
          value={task.title}
          onChangeText={(v) => dispatch({ type: 'RENAME_TASK', id: task.id, title: v })}
          style={{ fontSize: 16, fontWeight: '500' }}
          accessibilityLabel="やることの名前"
        />
      </View>

      <View style={{ gap: 8 }}>
        <Label>分け方の細かさ</Label>
        <View style={styles.segment}>
          {LEVELS.map((l) => {
            const on = l.key === level;
            return (
              <Pressable
                key={l.key}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
                onPress={() => setLevel(l.key)}
                style={[styles.segBtn, on && styles.segOn]}
              >
                <Text style={{ fontSize: 14, color: on ? colors.ink : '#3E4D52', fontWeight: on ? '700' : '400' }}>{l.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {!breakdownProvider.isRealAI && (
        <View style={styles.trial}>
          <Text style={styles.trialText}>
            いまの分割は「仮版」です。本物のAIではなく、決まったルールで分けています。内容に合わない分け方になることがあり、本物のAIの使い心地はこの仮版では確かめられません。
          </Text>
        </View>
      )}

      {confirmReplace ? (
        <View style={styles.confirm}>
          <Text style={{ fontSize: 14, color: colors.ink }}>今の手順を、新しい分け方で置き換えますか？</Text>
          <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}>
            <Btn small kind="ghost" label="やめる" onPress={() => setConfirmReplace(false)} />
            <Btn small label="置き換える" onPress={runBreakdown} />
          </View>
        </View>
      ) : (
        <Btn
          kind="primary"
          label={busy ? '分けています…' : task.steps.length > 0 ? '別の分け方を出す（仮版）' : '小さく分ける（仮版）'}
          onPress={onBreakdownPress}
          disabled={busy}
        />
      )}

      <Card style={{ paddingVertical: 8, gap: 0 }}>
        {task.steps.length === 0 && (
          <Text style={[styles.hint, { paddingVertical: 12 }]}>
            まだ手順がありません。上のボタンで分けるか、下の「手順を足す」で自分で入れられます。
          </Text>
        )}
        {task.steps.map((s, i) => (
          <View key={s.id} style={[styles.stepRow, i < task.steps.length - 1 && styles.stepLine]}>
            <View style={[styles.dot, s.done ? styles.dotDone : i === task.steps.findIndex((x) => !x.done) ? styles.dotNow : null]}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: s.done ? '#FFFFFF' : colors.ink }}>{s.done ? '✓' : i + 1}</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
              <Field
                value={s.label}
                onChangeText={(v) => dispatch({ type: 'UPDATE_STEP', id: task.id, stepId: s.id, label: v })}
                placeholder="手順を書く"
                multiline
                blurOnSubmit
                style={styles.stepField}
                accessibilityLabel={`手順${i + 1}`}
              />
              <View style={styles.minRow}>
                <IconBtn label="−" a11y="1分へらす" onPress={() => dispatch({ type: 'UPDATE_STEP', id: task.id, stepId: s.id, minutes: s.minutes - 1 })} />
                <Text style={styles.minText}>{s.minutes}分</Text>
                <IconBtn label="＋" a11y="1分ふやす" onPress={() => dispatch({ type: 'UPDATE_STEP', id: task.id, stepId: s.id, minutes: s.minutes + 1 })} />
                <View style={{ flex: 1 }} />
                <IconBtn label="↑" a11y="上へ" disabled={i === 0} onPress={() => dispatch({ type: 'MOVE_STEP', id: task.id, stepId: s.id, dir: -1 })} />
                <IconBtn label="↓" a11y="下へ" disabled={i === task.steps.length - 1} onPress={() => dispatch({ type: 'MOVE_STEP', id: task.id, stepId: s.id, dir: 1 })} />
                <IconBtn label="×" a11y="この手順を消す" onPress={() => dispatch({ type: 'DELETE_STEP', id: task.id, stepId: s.id })} />
              </View>
            </View>
          </View>
        ))}
        <Btn small kind="ghost" label="＋ 手順を足す" onPress={() => dispatch({ type: 'ADD_STEP', id: task.id })} />
      </Card>

      <Btn kind="accent" label="これを いま やる にして始める" onPress={start} style={{ marginTop: 'auto' }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 13, color: colors.sub, lineHeight: 19 },
  segment: { flexDirection: 'row', gap: 6, backgroundColor: '#DCE4E0', borderRadius: radius.m, padding: 4 },
  segBtn: { flex: 1, minHeight: 44, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: colors.surface },
  trial: { backgroundColor: colors.warnBg, borderRadius: radius.m, padding: 12 },
  trialText: { fontSize: 13, color: colors.warnInk, lineHeight: 19 },
  confirm: { backgroundColor: colors.surface, borderRadius: radius.m, padding: 12, gap: 6 },
  stepRow: { flexDirection: 'row', gap: 10, paddingVertical: 10, alignItems: 'flex-start' },
  stepLine: { borderBottomWidth: 1, borderBottomColor: colors.lineSoft },
  dot: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.lineSoft, marginTop: 10 },
  dotNow: { backgroundColor: colors.accent },
  dotDone: { backgroundColor: colors.link },
  stepField: { minHeight: 44, borderColor: colors.lineSoft, paddingTop: 11, paddingBottom: 11, lineHeight: 21, textAlignVertical: 'top' },
  minRow: { flexDirection: 'row', alignItems: 'center' },
  minText: { fontSize: 13, color: colors.sub, minWidth: 40, textAlign: 'center' },
});
