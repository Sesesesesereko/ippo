// メタデータ（スクショの情報と設定）の保存。AsyncStorage は Web ではブラウザ内（localStorage）、
// スマホでは端末内に保存されるので、同じコードのまま使える。画像そのものは images に分けて保存する。
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSettings, Item, SCHEMA_VERSION, Settings } from '../domain/types';
import { createInitialState, DataState } from '../state/reducer';

const ITEMS_KEY = 'shot:items:v1';
const SETTINGS_KEY = 'shot:settings:v1';

export async function loadState(): Promise<{ state: DataState; ok: boolean }> {
  try {
    const [rawItems, rawSettings] = await Promise.all([AsyncStorage.getItem(ITEMS_KEY), AsyncStorage.getItem(SETTINGS_KEY)]);
    const items = rawItems ? (JSON.parse(rawItems) as Item[]) : [];
    const settings: Settings = { ...createSettings(), ...(rawSettings ? (JSON.parse(rawSettings) as Partial<Settings>) : {}), schemaVersion: SCHEMA_VERSION };
    return { state: { items: Array.isArray(items) ? items : [], settings }, ok: true };
  } catch {
    return { state: createInitialState(), ok: false };
  }
}

let chain: Promise<unknown> = Promise.resolve();

/** 順番に保存する（前の保存が終わってから次を書く） */
export function saveState(state: DataState): Promise<boolean> {
  const job = chain.then(async () => {
    try {
      await AsyncStorage.multiSet([
        [ITEMS_KEY, JSON.stringify(state.items)],
        [SETTINGS_KEY, JSON.stringify(state.settings)],
      ]);
      return true;
    } catch {
      return false;
    }
  });
  chain = job;
  return job;
}
