// アプリのデータを読み込み・保存し、画面に配る。読み取りの順番待ちも画面の外（ここ）で管理するので、
// 画面を移っても読み取りは止まらない。
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { toKey } from '../domain/dates';
import { analyzeText, hasMeaningfulText } from '../domain/rules';
import { createSamples } from '../domain/sample';
import { cleanOcrText } from '../domain/text';
import { Category, Item, MAX_IMPORT, Settings } from '../domain/types';
import { clearImages, deleteImage, getImageData, ImageError, PickedImage, prepareImage, putImage } from '../services/images';
import { ocrEngine } from '../services/ocr';
import { loadState, saveState } from '../services/storage';
import { Action, afterLoad, createInitialState, DataState, newItem, reducer } from './reducer';

/** 読み取り画面に出す、今回選んだ1枚 */
export interface BatchEntry {
  key: string;
  name: string;
  itemId?: string;
  error?: 'cannotOpen' | 'heic' | 'full';
}

export interface Batch {
  entries: BatchEntry[];
  /** 20枚を超えたとき */
  overLimit: boolean;
  /** 入らなかった枚数（いっぱいのとき） */
  fullCount: number;
}

export interface Toast {
  id: number;
  text: string;
  undo?: () => void;
  ms: number;
}

interface AppStateValue {
  ready: boolean;
  storageOk: boolean;
  items: Item[];
  settings: Settings;
  batch: Batch | null;
  toast: Toast | null;
  showToast: (text: string, opts?: { undo?: () => void; ms?: number }) => void;
  hideToast: () => void;
  addSamples: () => void;
  removeSamples: () => void;
  importImages: (picked: PickedImage[]) => Promise<void>;
  retry: (id: string) => void;
  setTitle: (id: string, title: string) => void;
  setCategory: (id: string, c: Category) => void;
  setDue: (id: string, due: string | null) => void;
  setDone: (id: string, done: boolean) => void;
  remove: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  patchSettings: (p: Partial<Settings>) => void;
}

const Ctx = createContext<AppStateValue | null>(null);

const nowIso = () => new Date().toISOString();
const today = () => toKey(new Date());
let seq = 0;
const newId = () => `s${Date.now().toString(36)}${(seq++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, rawDispatch] = useReducer(reducer, undefined, createInitialState);
  const [ready, setReady] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const stateRef = useRef<DataState>(state);
  const loaded = useRef(false);

  // 最新の状態を、非同期の処理（読み取りの順番待ち）からも見られるようにする
  const dispatch = useCallback((a: Action) => {
    stateRef.current = reducer(stateRef.current, a);
    rawDispatch(a);
  }, []);

  useEffect(() => {
    let alive = true;
    loadState().then(({ state: s, ok }) => {
      if (!alive) return;
      dispatch({ type: 'LOAD', state: afterLoad(s) });
      setStorageOk(ok);
      loaded.current = true;
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [dispatch]);

  useEffect(() => {
    if (!loaded.current) return;
    saveState(state).then(setStorageOk);
  }, [state]);

  // ---------- お知らせ ----------
  const toastSeq = useRef(0);
  const showToast = useCallback((text: string, opts?: { undo?: () => void; ms?: number }) => {
    toastSeq.current += 1;
    setToast({ id: toastSeq.current, text, undo: opts?.undo, ms: opts?.ms ?? 3000 });
  }, []);
  const hideToast = useCallback(() => setToast(null), []);

  // ---------- 読み取りの順番待ち ----------
  const queue = useRef<string[]>([]);
  const sources = useRef(new Map<string, Blob | string>());
  const running = useRef(false);
  const doneInRun = useRef(0);

  const runQueue = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    doneInRun.current = 0;
    while (queue.current.length > 0) {
      const id = queue.current.shift()!;
      const item = stateRef.current.items.find((i) => i.id === id);
      if (!item) {
        sources.current.delete(id);
        continue;
      }
      dispatch({ type: 'SET_STATUS', id, status: 'reading', at: nowIso() });
      let source = sources.current.get(id) ?? null;
      if (!source) source = await getImageData(id);
      sources.current.delete(id);
      if (!source) {
        dispatch({ type: 'APPLY_OCR', id, text: '', analysis: null, failReason: 'noText', at: nowIso(), todayKey: today() });
        continue;
      }
      const result = await ocrEngine.recognize(source);
      if (!stateRef.current.items.some((i) => i.id === id)) continue; // 読み取り中に消された
      if (result.ok) {
        if (!stateRef.current.settings.ocrReady) dispatch({ type: 'SETTINGS', patch: { ocrReady: true } });
        const text = cleanOcrText(result.text);
        if (hasMeaningfulText(text)) {
          dispatch({ type: 'APPLY_OCR', id, text, analysis: analyzeText(text, today()), at: nowIso(), todayKey: today() });
        } else {
          dispatch({ type: 'APPLY_OCR', id, text, analysis: null, failReason: 'noText', at: nowIso(), todayKey: today() });
        }
      } else {
        dispatch({
          type: 'APPLY_OCR',
          id,
          text: '',
          analysis: null,
          failReason: result.reason === 'unavailable' ? 'unavailable' : 'noText',
          at: nowIso(),
          todayKey: today(),
        });
      }
      doneInRun.current += 1;
    }
    running.current = false;
    if (doneInRun.current > 0) showToast(`${doneInRun.current}枚の読み取りが終わりました`);
  }, [dispatch, showToast]);

  const enqueue = useCallback(
    (id: string, source?: Blob | string) => {
      if (source) sources.current.set(id, source);
      if (!queue.current.includes(id)) queue.current.push(id);
      void runQueue();
    },
    [runQueue],
  );

  // ---------- 操作 ----------
  const importImages = useCallback(
    async (picked: PickedImage[]) => {
      const list = picked.slice(0, MAX_IMPORT);
      const entries: BatchEntry[] = list.map((p, i) => ({ key: `${Date.now()}-${i}`, name: p.name }));
      const b: Batch = { entries, overLimit: picked.length > MAX_IMPORT, fullCount: 0 };
      setBatch({ ...b, entries: [...entries] });
      for (let i = 0; i < list.length; i++) {
        try {
          const prepared = await prepareImage(list[i]);
          const id = newId();
          await putImage(id, prepared.data);
          dispatch({ type: 'ADD_ITEM', item: newItem(id, new Date(), today(), prepared.width, prepared.height) });
          entries[i] = { ...entries[i], itemId: id };
          enqueue(id, prepared.ocrSource);
        } catch (e) {
          const kind = e instanceof ImageError ? e.kind : 'cannotOpen';
          entries[i] = { ...entries[i], error: kind };
          if (kind === 'full') b.fullCount += 1;
        }
        setBatch({ ...b, entries: [...entries] });
      }
    },
    [dispatch, enqueue],
  );

  const retry = useCallback((id: string) => enqueue(id), [enqueue]);

  const value = useMemo<AppStateValue>(
    () => ({
      ready,
      storageOk,
      items: state.items,
      settings: state.settings,
      batch,
      toast,
      showToast,
      hideToast,
      addSamples: () => dispatch({ type: 'ADD_SAMPLES', items: createSamples(today(), new Date()) }),
      removeSamples: () => dispatch({ type: 'REMOVE_SAMPLES' }),
      importImages,
      retry,
      setTitle: (id, title) => dispatch({ type: 'SET_TITLE', id, title, at: nowIso(), todayKey: today() }),
      setCategory: (id, category) => dispatch({ type: 'SET_CATEGORY', id, category, at: nowIso(), todayKey: today() }),
      setDue: (id, due) => dispatch({ type: 'SET_DUE', id, due, at: nowIso() }),
      setDone: (id, done) => dispatch({ type: 'SET_DONE', id, done, at: nowIso() }),
      remove: async (id) => {
        dispatch({ type: 'DELETE', id });
        await deleteImage(id);
      },
      clearAll: async () => {
        queue.current = [];
        sources.current.clear();
        dispatch({ type: 'CLEAR_ALL' });
        setBatch(null);
        await clearImages();
      },
      patchSettings: (patch) => dispatch({ type: 'SETTINGS', patch }),
    }),
    [ready, storageOk, state, batch, toast, showToast, hideToast, importImages, retry, dispatch],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppStateValue {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp は AppStateProvider の中で使ってください');
  return v;
}
