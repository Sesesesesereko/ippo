// F メニュー画面
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../state/AppState';
import { ConfirmSheet, ProvisionalSheet } from '../ui/overlays';
import { Note, NoteText, PLACE_WORD, Screen, TopBar } from '../ui/parts';
import { colors, font, radius } from '../ui/theme';

function Row({ label, onPress, danger }: { label: string; onPress: () => void; danger?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [s.row, pressed && { opacity: 0.6 }]}>
      <Text style={[s.rowText, danger && { color: colors.danger }]}>{label}</Text>
      <Text style={s.chev}>›</Text>
    </Pressable>
  );
}

export default function Menu() {
  const { items, addSamples, removeSamples, clearAll, showToast } = useApp();
  const [prov, setProv] = useState(false);
  const [confirmAll, setConfirmAll] = useState(false);
  const sampleCount = items.filter((i) => i.isSample).length;
  const hasSample = sampleCount > 0;
  const ownCount = items.filter((i) => !i.isSample).length;

  return (
    <Screen>
      <TopBar title="メニュー" />
      <View style={s.group}>
        <Row label="仮版について" onPress={() => setProv(true)} />
        <Row
          label="使い方をもう一度見る"
          onPress={() => router.push('/welcome')}
        />
        {hasSample ? (
          <Row
            label="見本を消す"
            onPress={() => {
              removeSamples();
              showToast('見本を消しました');
            }}
          />
        ) : (
          <Row
            label="見本をもう一度入れる"
            onPress={() => {
              addSamples();
              router.dismissTo('/');
            }}
          />
        )}
      </View>

      <Text style={s.h}>データについて</Text>
      <Note>
        <NoteText>データは{PLACE_WORD}の中だけにあります</NoteText>
        <NoteText>
          {Platform.OS === 'web'
            ? 'ブラウザの記録を消す・別のブラウザで開く・長く使わないと、なくなることがあります'
            : 'アプリを消すと、なくなります'}
        </NoteText>
        <NoteText>
          今の量：スクショ {ownCount}枚{hasSample ? `（ほかに見本 ${sampleCount}件）` : ''}
        </NoteText>
      </Note>

      <View style={[s.group, { marginTop: 24 }]}>
        <Row label="すべて消す" danger onPress={() => setConfirmAll(true)} />
      </View>

      <ProvisionalSheet visible={prov} onClose={() => setProv(false)} />
      <ConfirmSheet
        visible={confirmAll}
        title="すべて消しますか？"
        body="もとに戻せません"
        okLabel="すべて消す"
        onCancel={() => setConfirmAll(false)}
        onOk={() => {
          setConfirmAll(false);
          void clearAll();
          showToast('すべて消しました');
        }}
      />
    </Screen>
  );
}

const s = StyleSheet.create({
  group: { backgroundColor: colors.card, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, overflow: 'hidden', marginTop: 8 },
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  rowText: { flex: 1, fontSize: font.body, color: colors.ink, fontWeight: '600' },
  chev: { fontSize: 22, color: colors.sub },
  h: { fontSize: font.body, fontWeight: '700', color: colors.sub, marginTop: 24, marginBottom: 10 },
});
