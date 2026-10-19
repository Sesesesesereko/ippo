// Web版の「日付を選ぶ」：ブラウザの日付選び（input type=date）を札の上に透明に重ねる。
// 押すとスマホのブラウザでもパソコンでも、それぞれの日付選びが開く。
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip } from './parts';

export function DatePick({ value, onPick }: { value: string | null; onPick: (key: string) => void }) {
  return (
    <View style={s.wrap}>
      <Chip label="日付を選ぶ" onPress={() => undefined} />
      <input
        type="date"
        aria-label="日付を選ぶ"
        data-testid="date-input"
        value={value ?? ''}
        onChange={(e) => {
          const v = e.currentTarget.value;
          if (/^\d{4}-\d{2}-\d{2}$/.test(v)) onPick(v);
        }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', border: 0, padding: 0, margin: 0 }}
      />
    </View>
  );
}

const s = StyleSheet.create({ wrap: { position: 'relative' } });
