// 何度も使う小さな部品。
import React from 'react';
import { ActivityIndicator, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Category, CATEGORY_LABEL } from '../domain/types';
import { BackIcon, CategoryIcon, CheckIcon } from './icons';
import { CATEGORY_COLOR, colors, font, MAIN_BUTTON, MAX_WIDTH, radius, TOUCH } from './theme';

/** データの置き場所の言い方（Web：ブラウザ、スマホ：端末） */
export const PLACE_WORD = Platform.OS === 'web' ? 'このブラウザ' : 'この端末';

/** 画面の外枠。中身は縦に流れ、bottom は画面の下に固定される */
export function Screen({ children, bottom, scroll = true }: { children: React.ReactNode; bottom?: React.ReactNode; scroll?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {scroll ? (
        <ScrollView style={styles.flex} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.inner}>{children}</View>
        </ScrollView>
      ) : (
        <View style={[styles.flex, styles.inner]}>{children}</View>
      )}
      {bottom ? (
        <View style={[styles.bottomBar, { paddingBottom: 12 + insets.bottom }]}>
          <View style={styles.bottomInner}>{bottom}</View>
        </View>
      ) : null}
    </View>
  );
}

export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

/** 上の帯：左に「＜ もどる」、中央に見出し */
export function TopBar({ title, onBack = goBack }: { title?: string; onBack?: () => void }) {
  return (
    <View style={styles.topBar}>
      <Pressable accessibilityRole="button" accessibilityLabel="もどる" onPress={onBack} style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}>
        <BackIcon color={colors.link} />
        <Text style={styles.backText}>もどる</Text>
      </Pressable>
      {title ? (
        <Text style={styles.topTitle} accessibilityRole="header">
          {title}
        </Text>
      ) : null}
      <View style={styles.backSpacer} />
    </View>
  );
}

/** 主なボタン（藍色の塗りつぶし）。1画面に1つだけ使う */
export function MainButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.mainBtn, pressed && styles.pressed, disabled && { opacity: 0.5 }]}
    >
      <Text style={styles.mainBtnText}>{label}</Text>
    </Pressable>
  );
}

/** 枠線のボタン（主なボタン以外の大事な操作） */
export function OutlineButton({ label, onPress, danger, style }: { label: string; onPress: () => void; danger?: boolean; style?: ViewStyle }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.outlineBtn, danger && { borderColor: colors.danger }, pressed && styles.pressed, style]}
    >
      <Text style={[styles.outlineText, danger && { color: colors.danger }]}>{label}</Text>
    </Pressable>
  );
}

/** 文字のボタン（下線つき） */
export function TextButton({ label, onPress, color = colors.link, style, underline = true, textStyle, accessibilityLabel }: {
  label: string;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
  underline?: boolean;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} onPress={onPress} style={({ pressed }) => [styles.textBtn, pressed && styles.pressed, style]}>
      <Text style={[styles.textBtnText, { color }, underline && { textDecorationLine: 'underline' }, textStyle]}>{label}</Text>
    </Pressable>
  );
}

/** 種類の札（薄い背景＋濃い色の文字と印）。selected なら塗りつぶし＋チェック */
export function CategoryTag({ category, selected, size = 'm', onPress, count, label, fill }: {
  category: Category;
  selected?: boolean;
  size?: 's' | 'm';
  onPress?: () => void;
  count?: number;
  label?: string;
  /** 枠いっぱいに広げ、中央にそろえる（くわしく画面の 3つずつ2段） */
  fill?: boolean;
}) {
  const c = CATEGORY_COLOR[category];
  const fg = selected ? '#FFFFFF' : c.fg;
  const body = (
    <>
      {selected ? <CheckIcon color={fg} size={size === 's' ? 13 : 16} /> : <CategoryIcon category={category} color={fg} size={size === 's' ? 13 : 16} />}
      <Text style={[styles.tagText, size === 's' && styles.tagTextS, fill && styles.tagTextFill, { color: fg }]} numberOfLines={1}>
        {label ?? CATEGORY_LABEL[category]}
        {count !== undefined ? ` ${count}` : ''}
      </Text>
    </>
  );
  const style = [styles.tag, size === 's' ? styles.tagS : styles.tagM, fill && styles.tagFill, { backgroundColor: selected ? c.fg : c.bg }];
  if (!onPress) return <View style={style}>{body}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [...style, pressed && styles.pressed]}
    >
      {body}
    </Pressable>
  );
}

/** 選び札（期限の候補・「すべて」など、種類以外） */
export function Chip({ label, selected, onPress, accessibilityLabel }: { label: string; selected?: boolean; onPress: () => void; accessibilityLabel?: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}
    >
      {selected ? <CheckIcon color="#FFFFFF" size={15} /> : null}
      <Text style={[styles.chipText, selected && { color: '#FFFFFF' }]}>{label}</Text>
    </Pressable>
  );
}

/** 「仮版」の印（灰色の枠線だけ） */
export function ProvisionalBadge({ onPress }: { onPress?: () => void }) {
  const body = <Text style={styles.provText}>仮版</Text>;
  if (!onPress) return <View style={styles.prov}>{body}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="仮版について" onPress={onPress} hitSlop={8} style={({ pressed }) => [styles.provTouch, pressed && styles.pressed]}>
      <View style={styles.prov}>{body}</View>
    </Pressable>
  );
}

/** 状態の札（見本・使った・済んだ・期限切れ） */
export function StateTag({ label, dashed }: { label: string; dashed?: boolean }) {
  return (
    <View style={[styles.stateTag, dashed && { borderStyle: 'dashed' }]}>
      <Text style={styles.stateTagText}>{label}</Text>
    </View>
  );
}

/** 灰色の枠の注意書き */
export function Note({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.note, style]}>{children}</View>;
}

export function NoteText({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.noteText, style]}>{children}</Text>;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Text style={styles.sectionTitle} accessibilityRole="header">
      {children}
    </Text>
  );
}

export function Loading() {
  return (
    <View style={[styles.screen, { alignItems: 'center', justifyContent: 'center' }]}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

/** 下からせり上がる小さな窓 */
export function Sheet({ visible, onClose, title, children }: { visible: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.sheetWrap}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="窓をとじる" />
        <View style={[styles.sheet, { paddingBottom: 20 + insets.bottom }]} accessibilityViewIsModal>
          {title ? <Text style={styles.sheetTitle}>{title}</Text> : null}
          {children}
        </View>
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { flexGrow: 1, paddingBottom: 24 },
  inner: { width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center', paddingHorizontal: 16 },
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    backgroundColor: colors.bg,
    paddingTop: 12,
    paddingHorizontal: 16,
  },
  bottomInner: { width: '100%', maxWidth: MAX_WIDTH, alignSelf: 'center' },
  pressed: { opacity: 0.6 },
  topBar: { flexDirection: 'row', alignItems: 'center', minHeight: 56, marginHorizontal: -8 },
  backBtn: { flexDirection: 'row', alignItems: 'center', minHeight: TOUCH, minWidth: 96, paddingHorizontal: 8, gap: 2 },
  backText: { color: colors.link, fontSize: font.body, fontWeight: '600' },
  backSpacer: { minWidth: 96 },
  topTitle: { flex: 1, textAlign: 'center', fontSize: font.title - 2, fontWeight: '700', color: colors.ink },
  mainBtn: {
    height: MAIN_BUTTON,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  mainBtnText: { color: colors.primaryInk, fontSize: 17, fontWeight: '700' },
  outlineBtn: {
    minHeight: TOUCH + 4,
    borderRadius: radius.button,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.card,
  },
  outlineText: { color: colors.primary, fontSize: font.body, fontWeight: '700' },
  textBtn: { minHeight: TOUCH, minWidth: TOUCH, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8 },
  textBtnText: { fontSize: font.body, fontWeight: '600' },
  tag: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.pill, gap: 6, alignSelf: 'flex-start' },
  tagM: { minHeight: TOUCH, paddingHorizontal: 14 },
  tagS: { paddingHorizontal: 8, paddingVertical: 3, gap: 4 },
  tagText: { fontSize: font.body, fontWeight: '700' },
  tagTextS: { fontSize: 13 },
  tagFill: { alignSelf: 'stretch', justifyContent: 'center', paddingHorizontal: 6, gap: 4 },
  tagTextFill: { fontSize: 15, flexShrink: 1 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: TOUCH,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    backgroundColor: colors.card,
  },
  chipSelected: { backgroundColor: '#3D3D3D', borderColor: '#3D3D3D' },
  chipText: { fontSize: font.body, color: colors.ink, fontWeight: '600' },
  provTouch: { minHeight: TOUCH, minWidth: TOUCH, justifyContent: 'center', alignItems: 'center' },
  prov: { borderWidth: 1, borderColor: '#8A8A8A', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1 },
  provText: { fontSize: 13, color: '#5A5A5A', fontWeight: '600' },
  stateTag: { borderWidth: 1, borderColor: '#8A8A8A', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1, backgroundColor: '#FFFFFF' },
  stateTagText: { fontSize: 13, color: '#4A4A4A', fontWeight: '600' },
  note: { backgroundColor: colors.noteBg, borderRadius: radius.card, borderWidth: 1, borderColor: colors.line, padding: 14, gap: 6 },
  noteText: { fontSize: font.small, color: '#4F4F4F', lineHeight: 21 },
  sectionTitle: { fontSize: font.title, fontWeight: '700', color: colors.ink, marginTop: 20, marginBottom: 10 },
  sheetWrap: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    gap: 12,
    width: '100%',
    maxWidth: MAX_WIDTH,
    alignSelf: 'center',
  },
  sheetTitle: { fontSize: font.title, fontWeight: '700', color: colors.ink },
});
