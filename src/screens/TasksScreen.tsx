import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppState } from '../state/AppState';
import { useNav } from '../navigation/Nav';
import { Btn, Card, Field, Header, IconBtn, Label, Screen } from '../ui/parts';
import { colors } from '../ui/theme';
import { doneTasks } from '../domain/selectors';

export function TasksScreen() {
  const { data, dispatch } = useAppState();
  const nav = useNav();
  const [draft, setDraft] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const open = data.tasks.filter((t) => !t.done);
  const done = doneTasks(data);

  const add = () => {
    if (!draft.trim()) return;
    dispatch({ type: 'ADD_TASK', title: draft });
    setDraft('');
  };

  return (
    <Screen>
      <Header title="やること一覧" />

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Field value={draft} onChangeText={setDraft} onSubmitEditing={add} placeholder="やることを追加" style={{ flex: 1, minWidth: 0 }} accessibilityLabel="やることを追加" />
        <Btn label="追加" onPress={add} style={{ minHeight: 48, minWidth: 72 }} />
      </View>

      <Text style={styles.hint}>一番上が「いま やる ひとつ」になります。↑↓で並べ替えできます。</Text>

      <Card style={{ paddingVertical: 4, gap: 0 }}>
        {open.length === 0 && <Text style={[styles.hint, { paddingVertical: 14 }]}>まだ何もありません。</Text>}
        {open.map((t, i) => (
          <View key={t.id} style={[styles.row, i < open.length - 1 && styles.rowLine]}>
            {confirmId === t.id ? (
              <View style={styles.confirm}>
                <Text style={{ flex: 1, fontSize: 14, color: colors.ink }}>「{t.title}」を消しますか？</Text>
                <Btn small kind="ghost" label="やめる" onPress={() => setConfirmId(null)} />
                <Btn small kind="danger" label="消す" onPress={() => { dispatch({ type: 'DELETE_TASK', id: t.id }); setConfirmId(null); }} />
              </View>
            ) : (
              <>
                <Pressable style={styles.titleHit} onPress={() => nav.push({ name: 'taskEdit', taskId: t.id })} accessibilityRole="button">
                  {i === 0 && <Text style={styles.nowTag}>いま</Text>}
                  <Text style={styles.title} numberOfLines={2}>{t.title}</Text>
                  {t.steps.length > 0 && (
                    <Text style={styles.meta}>
                      {t.steps.filter((s) => s.done).length}/{t.steps.length}歩
                    </Text>
                  )}
                </Pressable>
                <IconBtn label="↑" a11y={`${t.title}を上へ`} disabled={i === 0} onPress={() => dispatch({ type: 'MOVE_TASK', id: t.id, dir: -1 })} />
                <IconBtn label="↓" a11y={`${t.title}を下へ`} disabled={i === open.length - 1} onPress={() => dispatch({ type: 'MOVE_TASK', id: t.id, dir: 1 })} />
                <IconBtn label="×" a11y={`${t.title}を消す`} onPress={() => setConfirmId(t.id)} />
              </>
            )}
          </View>
        ))}
      </Card>

      {done.length > 0 && (
        <View style={{ gap: 8 }}>
          <Label>できたこと {done.length}件</Label>
          {done.map((t) => (
            <Text key={t.id} style={styles.doneItem}>✓ {t.title}</Text>
          ))}
          <Btn small kind="ghost" label="できたことを一覧から片付ける" onPress={() => dispatch({ type: 'CLEAR_DONE' })} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 13, color: colors.sub, lineHeight: 19 },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 56 },
  rowLine: { borderBottomWidth: 1, borderBottomColor: colors.lineSoft },
  titleHit: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 52 },
  nowTag: { fontSize: 11, color: colors.ink, backgroundColor: colors.accent, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, overflow: 'hidden' },
  title: { flexShrink: 1, fontSize: 15, color: colors.ink },
  meta: { fontSize: 12, color: colors.sub },
  confirm: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  doneItem: { fontSize: 14, color: colors.sub },
});
