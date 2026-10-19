// スマホ版の「日付を選ぶ」（仮）：よく使う日を窓から選ぶ。端末の日付選びは正式版で入れる。
import React, { useState } from 'react';
import { View } from 'react-native';
import { addDays, formatMDW, toKey } from '../domain/dates';
import { Chip, OutlineButton, Sheet } from './parts';

export function DatePick({ onPick }: { value: string | null; onPick: (key: string) => void }) {
  const [open, setOpen] = useState(false);
  const today = toKey(new Date());
  const choices = [0, 1, 2, 3, 7, 14, 30].map((n) => addDays(today, n));
  return (
    <>
      <Chip label="日付を選ぶ" onPress={() => setOpen(true)} />
      <Sheet visible={open} onClose={() => setOpen(false)} title="日付を選ぶ">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {choices.map((k) => (
            <Chip
              key={k}
              label={formatMDW(k)}
              onPress={() => {
                onPick(k);
                setOpen(false);
              }}
            />
          ))}
        </View>
        <OutlineButton label="とじる" onPress={() => setOpen(false)} />
      </Sheet>
    </>
  );
}
