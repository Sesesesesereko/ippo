// 何度も使う小さな部品。
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { colors, font, radius, TOUCH } from './theme';
import { useNav } from '../navigation/Nav';
import { useAppState } from '../state/AppState';

export function Screen({ children, dark, scroll = true }: { children: React.ReactNode; dark?: boolean; scroll?: boolean }) {
  const bg = dark ? colors.deep : colors.bg;
  const inner = <View style={styles.inner}>{children}</View>;
  return (
    <View style={[styles.screen, { backgroundColor: bg }]}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {inner}
        </ScrollView>
      ) : (
        <View style={styles.scrollContent}>{inner}</View>
      )}
    </View>
  );
}

export function Header({ title, dark }: { title: string; dark?: boolean }) {
  const nav = useNav();
  const fg = dark ? '#F2F6F5' : colors.ink;
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="戻る" onPress={nav.back} style={styles.backBtn}>
        <Text style={{ fontSize: 22, color: fg }}>‹</Text>
      </Pressable>
      <Text style={[styles.headerTitle, { color: fg }]}>{title}</Text>
    </View>
  );
}

type BtnKind = 'accent' | 'primary' | 'ghost' | 'outlineDark' | 'danger';

export function Btn({
  label,
  onPress,
  kind = 'primary',
  disabled,
  style,
  small,
}: {
  label: string;
  onPress: () => void;
  kind?: BtnKind;
  disabled?: boolean;
  style?: ViewStyle;
  small?: boolean;
}) {
  const k = btnKinds[kind];
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        small && styles.btnSmall,
        { backgroundColor: k.bg, borderColor: k.border, opacity: disabled ? 0.45 : pressed ? 0.8 : 1 },
        style,
      ]}
    >
      <Text style={[styles.btnText, small && { fontSize: 14 }, { color: k.fg }]}>{label}</Text>
    </Pressable>
  );
}

const btnKinds: Record<BtnKind, { bg: string; fg: string; border: string }> = {
  accent: { bg: colors.accent, fg: colors.ink, border: colors.accent },
  primary: { bg: colors.deep, fg: '#F2F6F5', border: colors.deep },
  ghost: { bg: 'transparent', fg: colors.link, border: 'transparent' },
  outlineDark: { bg: 'transparent', fg: '#F2F6F5', border: colors.deepLine },
  danger: { bg: colors.danger, fg: '#FFFFFF', border: colors.danger },
};

export function Field(props: TextInputProps & { dark?: boolean }) {
  const { dark, style, ...rest } = props;
  return (
    <TextInput
      placeholderTextColor={dark ? '#7F9CA6' : '#8A9894'}
      {...rest}
      style={[
        styles.field,
        dark && { backgroundColor: colors.deepField, borderColor: colors.deepLine, color: '#F2F6F5' },
        style,
      ]}
    />
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Label({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return <Text style={[styles.label, dark && { color: colors.deepSub }]}>{children}</Text>;
}

/** データの保存場所を知らせる表示（試作の間は常に出す） */
export function StorageNotice() {
  const { data, dispatch, storage } = useAppState();
  const nav = useNav();
  if (storage === 'unavailable') {
    return (
      <Pressable onPress={() => nav.push({ name: 'data' })} style={[styles.notice, { backgroundColor: '#FBE3DF' }]}>
        <Text style={[styles.noticeText, { color: colors.danger }]}>
          このブラウザでは保存できていません。閉じると内容が消えます。詳しく見る ›
        </Text>
      </Pressable>
    );
  }
  if (!data.noticeDismissed) {
    return (
      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          試作版です。データはこのブラウザの中だけに保存されます。履歴の削除、別の端末やブラウザ、プライベートモードでは消えたり見えなかったりします。
        </Text>
        <View style={{ flexDirection: 'row', gap: 4, justifyContent: 'flex-end' }}>
          <Btn small kind="ghost" label="詳しく" onPress={() => nav.push({ name: 'data' })} />
          <Btn small kind="ghost" label="わかった" onPress={() => dispatch({ type: 'DISMISS_NOTICE' })} />
        </View>
      </View>
    );
  }
  return (
    <Pressable onPress={() => nav.push({ name: 'data' })} style={styles.noticeMini}>
      <Text style={styles.noticeMiniText}>試作版：データはこのブラウザ内だけに保存 ›</Text>
    </Pressable>
  );
}

export function IconBtn({ label, a11y, onPress, disabled }: { label: string; a11y: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.iconBtn, { opacity: disabled ? 0.3 : pressed ? 0.6 : 1 }]}
    >
      <Text style={{ fontSize: 16, color: colors.sub }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { flexGrow: 1, alignItems: 'center' },
  inner: {
    width: '100%',
    maxWidth: 520,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 28 : 56,
    paddingBottom: 32,
    gap: 16,
    flexGrow: 1,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  backBtn: { width: TOUCH, height: TOUCH, alignItems: 'center', justifyContent: 'center', marginLeft: -10 },
  headerTitle: { fontSize: font.title, fontWeight: '700' },
  btn: {
    minHeight: 52,
    borderRadius: radius.m,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  btnSmall: { minHeight: TOUCH, paddingHorizontal: 10 },
  btnText: { fontSize: 16, fontWeight: '700' },
  field: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.m,
    paddingHorizontal: 14,
    fontSize: font.body,
    backgroundColor: colors.surface,
    color: colors.ink,
  },
  card: { backgroundColor: colors.surface, borderRadius: radius.l, padding: 16, gap: 10 },
  label: { fontSize: font.label, color: colors.sub },
  notice: { backgroundColor: colors.warnBg, borderRadius: radius.m, padding: 12, gap: 4 },
  noticeText: { fontSize: font.label, color: colors.warnInk, lineHeight: 19 },
  noticeMini: { alignSelf: 'flex-start', minHeight: 28, justifyContent: 'center' },
  noticeMiniText: { fontSize: font.small, color: colors.warnInk },
  iconBtn: { width: 36, height: TOUCH, alignItems: 'center', justifyContent: 'center' },
});
