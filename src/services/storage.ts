// 保存処理。AsyncStorage は Web ではブラウザ内(localStorage)、
// スマホでは端末内に保存されるので、同じコードのまま使える。
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, createInitialData } from '../domain/types';

const KEY = 'ippo:data:v1';

export type StorageStatus = 'ok' | 'unavailable';

export async function loadData(): Promise<{ data: AppData; status: StorageStatus }> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return { data: createInitialData(), status: 'ok' };
    const parsed = JSON.parse(raw) as Partial<AppData>;
    // 足りない項目は初期値で補う（将来の項目追加に備える）
    return { data: { ...createInitialData(), ...parsed, version: 1 }, status: 'ok' };
  } catch {
    return { data: createInitialData(), status: 'unavailable' };
  }
}

export async function saveData(data: AppData): Promise<StorageStatus> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
    return 'ok';
  } catch {
    return 'unavailable';
  }
}

export async function clearData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    // 保存できない環境では何もしない
  }
}
