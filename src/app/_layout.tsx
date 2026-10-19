// 全画面の外枠：データの準備、画面の重なり（Stack）、下のお知らせ。
import React from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStateProvider, useApp } from '../state/AppState';
import { Loading } from '../ui/parts';
import { ToastHost } from '../ui/overlays';
import { colors } from '../ui/theme';

function Inner() {
  const { ready } = useApp();
  if (!ready) return <Loading />;
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
      <ToastHost />
      <StatusBar style="dark" />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppStateProvider>
        <Inner />
      </AppStateProvider>
    </SafeAreaProvider>
  );
}
