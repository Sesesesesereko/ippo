// 画面の上に重ねて出すもの：下のお知らせ（もとに戻す付き）、仮版についての窓、確認の窓。
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { toKey } from '../domain/dates';
import { useApp } from '../state/AppState';
import { OutlineButton, Sheet, TextButton } from './parts';
import { colors, font, MAX_WIDTH, TOUCH } from './theme';

export function ToastHost() {
  const { toast, hideToast } = useApp();
  const insets = useSafeAreaInsets();
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(hideToast, toast.ms);
    return () => clearTimeout(t);
  }, [toast, hideToast]);
  if (!toast) return null;
  return (
    <View pointerEvents="box-none" style={[s.toastWrap, { bottom: 88 + insets.bottom }]}>
      <View style={s.toast} accessibilityLiveRegion="polite" accessibilityRole="alert">
        <Text style={s.toastText}>{toast.text}</Text>
        {toast.undo ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              toast.undo?.();
              hideToast();
            }}
            style={({ pressed }) => [s.undo, pressed && { opacity: 0.6 }]}
          >
            <Text style={s.undoText}>もとに戻す</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const READ_WORD = Platform.OS === 'web' ? '文字の読み取りは簡単なしくみなので、まちがいが多めです。種類や期限は押すだけで直せます' : 'スマホ版の文字の読み取りは準備中です。種類や期限は押すだけで選べます';

export function ProvisionalSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Sheet visible={visible} onClose={onClose} title="今は試作の仮版です">
      <Text style={s.p}>{READ_WORD}</Text>
      <Text style={s.p}>本物のAIを使ったときの正確さは、この試作では確かめられません</Text>
      <Text style={s.p}>お知らせ（通知）はスマホ版でつきます。今はホームの一番上に、期限が近いものを出します</Text>
      <OutlineButton label="とじる" onPress={onClose} />
    </Sheet>
  );
}

export function ConfirmSheet({ visible, title, body, okLabel, cancelLabel = 'やめる', onOk, onCancel, danger = true }: {
  visible: boolean;
  title: string;
  body?: string;
  okLabel: string;
  cancelLabel?: string;
  onOk: () => void;
  onCancel: () => void;
  danger?: boolean;
}) {
  return (
    <Sheet visible={visible} onClose={onCancel} title={title}>
      {body ? <Text style={s.p}>{body}</Text> : null}
      <View style={s.row}>
        <OutlineButton label={cancelLabel} onPress={onCancel} style={s.half} />
        <OutlineButton label={okLabel} onPress={onOk} danger={danger} style={s.half} />
      </View>
    </Sheet>
  );
}

/** 今日の日付（日をまたいだら変わる） */
export function useToday(): string {
  const [key, setKey] = useState(() => toKey(new Date()));
  useEffect(() => {
    const t = setInterval(() => {
      const k = toKey(new Date());
      setKey((prev) => (prev === k ? prev : k));
    }, 60000);
    return () => clearInterval(t);
  }, []);
  return key;
}

export { TextButton };

const s = StyleSheet.create({
  toastWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingHorizontal: 16 },
  toast: {
    width: '100%',
    maxWidth: MAX_WIDTH - 32,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2F2F2F',
    borderRadius: 12,
    paddingLeft: 16,
    paddingRight: 6,
    minHeight: 52,
    gap: 8,
  },
  toastText: { flex: 1, color: '#FFFFFF', fontSize: font.body, paddingVertical: 10 },
  undo: { minHeight: TOUCH, minWidth: TOUCH, paddingHorizontal: 10, justifyContent: 'center' },
  undoText: { color: '#C9D0FF', fontSize: font.body, fontWeight: '700', textDecorationLine: 'underline' },
  p: { fontSize: font.body, color: colors.ink, lineHeight: 24 },
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
});
