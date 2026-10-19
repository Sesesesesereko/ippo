// アプリ全体で使うデータの形。Web版・スマホ版で共通。

export type Category = 'coupon' | 'event' | 'place' | 'want' | 'recipe' | 'other';

export const CATEGORY_ORDER: Category[] = ['coupon', 'event', 'place', 'want', 'recipe', 'other'];

export const CATEGORY_LABEL: Record<Category, string> = {
  coupon: 'クーポン',
  event: '予定',
  place: 'お店・場所',
  want: '買いたい物',
  recipe: 'レシピ',
  other: 'その他',
};

/** 読み取りの状態。failed＝文字が読めなかった、stopped＝途中で止まった */
export type ItemStatus = 'waiting' | 'reading' | 'ready' | 'failed' | 'stopped';

/** failed のときの理由。noText＝文字が無い、unavailable＝読み取りのしくみが使えない */
export type FailReason = 'noText' | 'unavailable';

export interface Item {
  id: string;
  createdAt: string; // ISO 日時
  updatedAt: string;
  /** 画像があるか（画像そのものは画像の保存場所に id で入っている）。見本は画像なし */
  hasImage: boolean;
  imageWidth: number;
  imageHeight: number;
  status: ItemStatus;
  failReason?: FailReason;
  ocrText: string;
  title: string;
  category: Category;
  dueDate: string | null; // 'YYYY-MM-DD'
  dueCandidates: string[]; // 最大3つ
  titleEdited: boolean;
  categoryEdited: boolean;
  dueEdited: boolean;
  done: boolean;
  doneAt: string | null;
  isSample: boolean;
}

export interface Settings {
  schemaVersion: number;
  seenWelcome: boolean;
  seenHint: boolean;
  askedRemoveSample: boolean;
  ocrReady: boolean;
}

export const SCHEMA_VERSION = 1;

export function createSettings(): Settings {
  return {
    schemaVersion: SCHEMA_VERSION,
    seenWelcome: false,
    seenHint: false,
    askedRemoveSample: false,
    ocrReady: false,
  };
}

/** 一度に入れられる枚数 */
export const MAX_IMPORT = 20;
