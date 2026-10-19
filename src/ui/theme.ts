// 色と大きさの決まり。画面設計（落ち着いた青緑＋押すボタンだけ黄色）に合わせている。
export const colors = {
  bg: '#EEF2EF',
  surface: '#FFFFFF',
  ink: '#1E2A2E',
  sub: '#56656A',
  line: '#C9D3CF',
  lineSoft: '#E1E8E4',
  deep: '#1E3A46', // 「いま やる ひとつ」と集中画面の背景
  deepSub: '#A9C7CF',
  deepLine: '#4C6E7B',
  deepField: '#234652',
  link: '#2B5F78',
  chip: '#DCE8EA',
  accent: '#F2B45A', // 押してほしいボタンだけに使う
  time: '#D9822B',
  warnBg: '#FFF4E0',
  warnInk: '#7A4B0C',
  danger: '#A63D2F',
};

export const radius = { s: 10, m: 14, l: 20, xl: 24 };

export const font = {
  small: 12,
  body: 15,
  label: 13,
  title: 20,
  big: 26,
};

/** タップできる部分の最小の大きさ（指で押しやすいように） */
export const TOUCH = 44;
