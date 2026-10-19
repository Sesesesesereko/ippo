import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppState } from '../state/AppState';
import { useNav } from '../navigation/Nav';
import { Btn, Header, Screen } from '../ui/parts';
import { colors, radius } from '../ui/theme';

const STEPS = [
  { title: 'やることを1つ入れる', body: '「数学の課題」「部屋の片付け」など、ひとことでOK。' },
  { title: '小さく分ける', body: '2〜10分で終わる「一歩」に分けます。分けなくても使えます。' },
  { title: '一歩だけやる', body: 'タイマーが残り時間を見せます。時間が過ぎても大丈夫。終わったら「できた」。' },
];

export function GuideScreen({ firstTime }: { firstTime?: boolean }) {
  const { dispatch } = useAppState();
  const nav = useNav();

  const finish = () => {
    dispatch({ type: 'FINISH_ONBOARDING' });
    if (!firstTime) nav.back();
  };
  const sample = () => {
    dispatch({ type: 'LOAD_SAMPLE' });
    nav.home();
  };

  return (
    <Screen>
      {firstTime ? <View style={{ height: 8 }} /> : <Header title="使い方" />}

      <View style={{ gap: 6 }}>
        <Text style={styles.eyebrow}>いっぽ の使い方</Text>
        <Text style={styles.lead}>やることを「始める」のを手伝うアプリです。</Text>
      </View>

      <View style={styles.list}>
        {STEPS.map((s, i) => (
          <View key={s.title} style={styles.item}>
            <View style={styles.num}>
              <Text style={styles.numText}>{i + 1}</Text>
            </View>
            <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
              <Text style={styles.itemTitle}>{s.title}</Text>
              <Text style={styles.itemBody}>{s.body}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.extra}>
        <Text style={styles.itemTitle}>毎日のこと</Text>
        <Text style={styles.itemBody}>歯みがきなどの日課は、タップでチェック。日付が変わるとリセットされ、連続日数は数えません。</Text>
      </View>

      <View style={{ gap: 10, marginTop: 'auto' }}>
        <Btn kind="accent" label="見本を入れて試す" onPress={sample} />
        <Btn kind="ghost" label={firstTime ? '自分で始める' : '閉じる'} onPress={finish} />
        <Text style={styles.note}>見本は名前に「（見本）」が付きます。一覧からいつでも消せます。</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: 13, color: colors.link, letterSpacing: 1 },
  lead: { fontSize: 24, fontWeight: '700', color: colors.ink, lineHeight: 34 },
  list: { gap: 12 },
  item: { flexDirection: 'row', gap: 14, backgroundColor: colors.surface, borderRadius: radius.l, padding: 16, alignItems: 'flex-start' },
  num: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.deep, alignItems: 'center', justifyContent: 'center' },
  numText: { color: '#F2F6F5', fontWeight: '700', fontSize: 15 },
  itemTitle: { fontSize: 16, fontWeight: '700', color: colors.ink },
  itemBody: { fontSize: 14, color: colors.sub, lineHeight: 21 },
  extra: { gap: 2, paddingHorizontal: 4 },
  note: { fontSize: 12, color: colors.sub, textAlign: 'center' },
});
