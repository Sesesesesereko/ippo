// データの変え方を1か所にまとめる（画面から切り離した純粋な関数。Web版・スマホ版で共通）。
import { Analysis, fallbackTitle, noTextTitle, redoDue } from '../domain/rules';
import { Category, createSettings, FailReason, Item, ItemStatus, Settings } from '../domain/types';

export interface DataState {
  items: Item[];
  settings: Settings;
}

export function createInitialState(): DataState {
  return { items: [], settings: createSettings() };
}

export type Action =
  | { type: 'LOAD'; state: DataState }
  | { type: 'ADD_SAMPLES'; items: Item[] }
  | { type: 'REMOVE_SAMPLES' }
  | { type: 'ADD_ITEM'; item: Item }
  | { type: 'SET_STATUS'; id: string; status: ItemStatus; at: string }
  | { type: 'APPLY_OCR'; id: string; text: string; analysis: Analysis | null; failReason?: FailReason; at: string; todayKey: string }
  | { type: 'SET_TITLE'; id: string; title: string; at: string; todayKey: string }
  | { type: 'SET_CATEGORY'; id: string; category: Category; at: string; todayKey: string }
  | { type: 'SET_DUE'; id: string; due: string | null; at: string }
  | { type: 'SET_DONE'; id: string; done: boolean; at: string }
  | { type: 'DELETE'; id: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'SETTINGS'; patch: Partial<Settings> };

function update(state: DataState, id: string, fn: (i: Item) => Item): DataState {
  return { ...state, items: state.items.map((i) => (i.id === id ? fn(i) : i)) };
}

export function reducer(state: DataState, action: Action): DataState {
  switch (action.type) {
    case 'LOAD':
      return action.state;
    case 'ADD_SAMPLES': {
      const others = state.items.filter((i) => !i.isSample);
      return { ...state, items: [...others, ...action.items], settings: { ...state.settings, seenWelcome: true } };
    }
    case 'REMOVE_SAMPLES':
      return { ...state, items: state.items.filter((i) => !i.isSample), settings: { ...state.settings, askedRemoveSample: true } };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.item], settings: { ...state.settings, seenWelcome: true } };
    case 'SET_STATUS':
      return update(state, action.id, (i) => ({ ...i, status: action.status, failReason: undefined, updatedAt: action.at }));
    case 'APPLY_OCR':
      return update(state, action.id, (i) => {
        const createdKey = i.createdAt.slice(0, 10);
        if (!action.analysis) {
          // 文字が読めなかった：人が直したものは残し、それ以外は「その他」に
          return {
            ...i,
            status: 'failed',
            failReason: action.failReason ?? 'noText',
            ocrText: action.text,
            category: i.categoryEdited ? i.category : 'other',
            title: i.titleEdited ? i.title : noTextTitle(localKey(i.createdAt) || createdKey),
            updatedAt: action.at,
          };
        }
        const a = action.analysis;
        const category = i.categoryEdited ? i.category : a.category;
        let dueDate = i.dueDate;
        if (!i.dueEdited) {
          dueDate = category === a.category ? a.dueDate : redoDue(action.text, category, action.todayKey);
        }
        let candidates = a.dueCandidates;
        if (dueDate && !candidates.includes(dueDate) && !i.dueEdited) candidates = [...candidates.slice(0, 2), dueDate];
        return {
          ...i,
          status: 'ready',
          failReason: undefined,
          ocrText: action.text,
          category,
          title: i.titleEdited ? i.title : a.title,
          dueDate,
          dueCandidates: candidates,
          updatedAt: action.at,
        };
      });
    case 'SET_TITLE':
      return update(state, action.id, (i) => {
        const t = action.title.trim();
        if (!t) {
          // 空にしたら「種類名 月/日」に戻す
          return { ...i, title: fallbackTitle(i.category, localKey(i.createdAt) || action.todayKey), titleEdited: false, updatedAt: action.at };
        }
        return { ...i, title: t, titleEdited: true, updatedAt: action.at };
      });
    case 'SET_CATEGORY':
      return update(state, action.id, (i) => {
        const next: Item = { ...i, category: action.category, categoryEdited: true, updatedAt: action.at };
        if (!i.dueEdited && (i.status === 'ready' || i.isSample)) {
          // 期限を人が直していなければ、新しい種類のルールで選び直す
          const redo = redoDue(i.ocrText, action.category, action.todayKey);
          next.dueDate = redo;
          if (redo && !next.dueCandidates.includes(redo)) next.dueCandidates = [...next.dueCandidates.slice(0, 2), redo];
        }
        if (!i.titleEdited && !i.isSample && isAutoTitle(i)) {
          next.title = fallbackTitle(action.category, localKey(i.createdAt) || action.todayKey);
        }
        return next;
      });
    case 'SET_DUE':
      return update(state, action.id, (i) => ({ ...i, dueDate: action.due, dueEdited: true, updatedAt: action.at }));
    case 'SET_DONE':
      return update(state, action.id, (i) => ({ ...i, done: action.done, doneAt: action.done ? action.at : null, updatedAt: action.at }));
    case 'DELETE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'CLEAR_ALL':
      return { ...state, items: [] };
    case 'SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.patch } };
  }
}

/** タイトルが自動の「種類名 月/日」の形か */
function isAutoTitle(i: Item): boolean {
  return /^(クーポン|予定|お店・場所|買いたい物|レシピ|その他) \d{1,2}\/\d{1,2}$/.test(i.title);
}

/** ISO日時 → 端末の日付 'YYYY-MM-DD' */
export function localKey(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const p = (n: number) => (n < 10 ? `0${n}` : String(n));
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** 読み込んだときの整え方：途中で止まった読み取りは「止まりました」にする */
export function afterLoad(state: DataState): DataState {
  return {
    ...state,
    items: state.items.map((i) => (i.status === 'waiting' || i.status === 'reading' ? { ...i, status: 'stopped' as const } : i)),
  };
}

/** 新しいスクショ（読み取り待ち） */
export function newItem(id: string, now: Date, todayKey: string, width: number, height: number): Item {
  const at = now.toISOString();
  return {
    id,
    createdAt: at,
    updatedAt: at,
    hasImage: true,
    imageWidth: width,
    imageHeight: height,
    status: 'waiting',
    ocrText: '',
    title: noTextTitle(todayKey),
    category: 'other',
    dueDate: null,
    dueCandidates: [],
    titleEdited: false,
    categoryEdited: false,
    dueEdited: false,
    done: false,
    doneAt: null,
    isSample: false,
  };
}
