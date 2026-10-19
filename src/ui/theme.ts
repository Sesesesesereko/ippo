// 色と大きさの決まり（設計書 6章）。
import { Category } from '../domain/types';

export const colors = {
  bg: '#FAF8F5',
  card: '#FFFFFF',
  ink: '#2B2B2B',
  sub: '#6B6B6B',
  line: '#E4E0DA',
  lineStrong: '#CFC9C0',
  primary: '#34418C', // 主なボタンだけに使う塗りつぶし
  primaryInk: '#FFFFFF',
  link: '#34418C',
  urgent: '#C53030', // 今日・明日の期限
  danger: '#B42318',
  noteBg: '#F1EFEB',
  overlay: 'rgba(30,30,30,0.45)',
};

export const CATEGORY_COLOR: Record<Category, { fg: string; bg: string }> = {
  coupon: { fg: '#B83280', bg: '#FBEAF3' },
  event: { fg: '#2B6CB0', bg: '#E8F0FA' },
  place: { fg: '#2F855A', bg: '#E6F4EC' },
  want: { fg: '#8A5A0B', bg: '#FBF1DE' },
  recipe: { fg: '#C05621', bg: '#FCEDE3' },
  other: { fg: '#5F6B7A', bg: '#EEF0F3' },
};

export const font = { small: 14, body: 16, title: 20, big: 24 };
export const radius = { card: 12, pill: 999, button: 14 };

/** 指で押す部分の最小の大きさ */
export const TOUCH = 44;
/** 主なボタンの高さ */
export const MAIN_BUTTON = 52;
/** 画面の最大の幅（パソコンで開いたときに広がりすぎないように） */
export const MAX_WIDTH = 560;
