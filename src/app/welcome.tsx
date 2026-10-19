// A はじめて画面
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../state/AppState';
import { pickImages } from '../services/picker';
import { MainButton, Note, NoteText, PLACE_WORD, ProvisionalBadge, Screen, TextButton } from '../ui/parts';
import { colors, font } from '../ui/theme';

const STEPS = ['1．スクショを入れる', '2．クーポン・予定・お店などに分かれる', '3．期限が近いものが一番上に出る'];

export default function Welcome() {
  const { addSamples, patchSettings, importImages } = useApp();

  const trySamples = () => {
    addSamples();
    router.dismissTo('/');
  };

  const startOwn = () => {
    // 画像選びはボタンを押したその場で開く必要がある（ブラウザの決まり）。選ばずにやめたら空のホームのまま
    const picking = pickImages();
    patchSettings({ seenWelcome: true });
    router.dismissTo('/');
    picking.then((files) => {
      if (files.length === 0) return;
      void importImages(files);
      router.push('/import');
    });
  };

  return (
    <Screen>
      <View style={s.head}>
        <Text style={s.appName} accessibilityRole="header">
          スクショ係
        </Text>
        <ProvisionalBadge />
      </View>
      <Text style={s.lead}>スクショを入れると、種類ごとに分けて、期限をお知らせします</Text>
      <View style={s.steps}>
        {STEPS.map((t) => (
          <View key={t} style={s.step}>
            <View style={s.dot} />
            <Text style={s.stepText}>{t}</Text>
          </View>
        ))}
      </View>
      <Note style={{ marginTop: 8 }}>
        <NoteText>今は試作の仮版です。読み取りはまちがいが多めです。あとで直せます。</NoteText>
        <NoteText>
          データは{PLACE_WORD}の中だけに入ります。{PLACE_WORD === 'このブラウザ' ? 'ブラウザの記録を消すと、なくなります。' : 'アプリを消すと、なくなります。'}
        </NoteText>
      </Note>
      <View style={s.actions}>
        <MainButton label="見本で試す" onPress={trySamples} />
        <TextButton label="自分のスクショではじめる" onPress={startOwn} />
      </View>
    </Screen>
  );
}

const s = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 40 },
  appName: { fontSize: 30, fontWeight: '800', color: colors.ink },
  lead: { fontSize: font.big - 2, lineHeight: 34, fontWeight: '700', color: colors.ink, marginTop: 20 },
  steps: { marginTop: 24, marginBottom: 16, gap: 14 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#8E97C9' },
  stepText: { fontSize: font.body + 1, color: colors.ink, flex: 1 },
  actions: { marginTop: 28, gap: 8 },
});
