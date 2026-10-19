// アプリのデータを読み込み・保存し、画面に配る。
import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from 'react';
import { AppData, createInitialData } from '../domain/types';
import { clearData, loadData, saveData, StorageStatus } from '../services/storage';
import { Action, reducer } from './reducer';

interface AppStateValue {
  data: AppData;
  dispatch: (a: Action) => void;
  ready: boolean;
  storage: StorageStatus;
  resetAll: () => Promise<void>;
}

const Ctx = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [data, dispatch] = useReducer(reducer, undefined, createInitialData);
  const [ready, setReady] = useState(false);
  const [storage, setStorage] = useState<StorageStatus>('ok');
  const loaded = useRef(false);

  useEffect(() => {
    let alive = true;
    loadData().then(({ data: d, status }) => {
      if (!alive) return;
      dispatch({ type: 'LOAD', data: d });
      dispatch({ type: 'RECORD_VISIT' });
      setStorage(status);
      loaded.current = true;
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    saveData(data).then(setStorage);
  }, [data]);

  const resetAll = async () => {
    await clearData();
    dispatch({ type: 'RESET_ALL' });
    dispatch({ type: 'RECORD_VISIT' });
  };

  return <Ctx.Provider value={{ data, dispatch, ready, storage, resetAll }}>{children}</Ctx.Provider>;
}

export function useAppState(): AppStateValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAppState は AppStateProvider の中で使ってください');
  return v;
}
