import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppState } from '../state/AppState';
import { useNav } from '../navigation/Nav';
import { Btn, Card, Header, Screen } from '../ui/parts';
import { colors } from '../ui/theme';

export function DataScreen() {
  const { storage, resetAll, data } = useAppState();
  const nav = useNav();
  const [confirm, setConfirm] = useState(false);

  return (
    <Screen>
      <Header title="データについて" />

      <Card>
        <Text style={styles.h}>保存されている場所</Text>
        <Text style={styles.p}>
          この試作版では、やること・日課・出発時刻などは、今使っているブラウザの中だけに保存されます。ネット上のサーバーには送っていません。
        </Text>
        <Text style={styles.status}>
          状態：{storage === 'ok' ? 'このブラウザに保存できています' : '保存できていません（閉じると消えます）'}
        </Text>
      </Card>

      <Card>
        <Text style={styles.h}>データが消える・見えなくなる場合</Text>
        <Text style={styles.p}>・ブラウザの履歴やサイトのデータを削除したとき</Text>
        <Text style={styles.p}>・別のスマホ、別のブラウザで開いたとき（中身は共有されません）</Text>
        <Text style={styles.p}>・プライベートモード（シークレットモード）で使ったとき</Text>
        <Text style={styles.p}>・ブラウザが容量を空けるために、自動で消したとき</Text>
        <Text style={[styles.p, { color: colors.sub }]}>大事な予定は、ほかの場所にも残しておいてください。将来のスマホ版では、より安全な保存方法を検討します。</Text>
      </Card>

      <Card>
        <Text style={styles.h}>すべてのデータを消す</Text>
        <Text style={styles.p}>やること {data.tasks.length}件、日課 {data.routines.length}件などをすべて消して、最初の状態に戻します。</Text>
        {confirm ? (
          <View style={{ gap: 8 }}>
            <Text style={[styles.p, { color: colors.danger }]}>本当に消しますか？ 元に戻せません。</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Btn kind="ghost" label="やめる" onPress={() => setConfirm(false)} style={{ flex: 1 }} />
              <Btn kind="danger" label="すべて消す" onPress={async () => { await resetAll(); setConfirm(false); nav.home(); }} style={{ flex: 1 }} />
            </View>
          </View>
        ) : (
          <Btn kind="ghost" label="消す…" onPress={() => setConfirm(true)} />
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h: { fontSize: 16, fontWeight: '700', color: colors.ink },
  p: { fontSize: 14, color: colors.ink, lineHeight: 21 },
  status: { fontSize: 13, color: colors.link },
});
