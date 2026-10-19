import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppState } from '../state/AppState';
import { Btn, Card, Field, Header, IconBtn, Screen } from '../ui/parts';
import { colors } from '../ui/theme';

export function RoutinesScreen() {
  const { data, dispatch } = useAppState();
  const [draft, setDraft] = useState('');

  const add = () => {
    if (!draft.trim()) return;
    dispatch({ type: 'ADD_ROUTINE', label: draft });
    setDraft('');
  };

  return (
    <Screen>
      <Header title="毎日のこと" />
      <Text style={styles.hint}>毎日くり返すことを入れておくと、ホームでチェックできます。日付が変わると、チェックはリセットされます。連続日数は数えません。</Text>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Field value={draft} onChangeText={setDraft} onSubmitEditing={add} placeholder="例：薬を飲む" style={{ flex: 1, minWidth: 0 }} accessibilityLabel="日課を追加" />
        <Btn label="追加" onPress={add} style={{ minHeight: 48, minWidth: 72 }} />
      </View>

      <Card style={{ paddingVertical: 4, gap: 0 }}>
        {data.routines.length === 0 && <Text style={[styles.hint, { paddingVertical: 14 }]}>まだありません。</Text>}
        {data.routines.map((r, i) => (
          <View key={r.id} style={[styles.row, i < data.routines.length - 1 && styles.line]}>
            <Text style={styles.label}>{r.label}</Text>
            <IconBtn label="×" a11y={`${r.label}を消す`} onPress={() => dispatch({ type: 'DELETE_ROUTINE', id: r.id })} />
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hint: { fontSize: 13, color: colors.sub, lineHeight: 19 },
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 52 },
  line: { borderBottomWidth: 1, borderBottomColor: colors.lineSoft },
  label: { flex: 1, fontSize: 15, color: colors.ink },
});
