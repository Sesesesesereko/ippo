// 日付の計算と表示。すべて端末の時刻（ローカル時刻）で扱う。

const WEEK = ['日', '月', '火', '水', '木', '金', '土'];

export function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/** Date → 'YYYY-MM-DD' */
export function toKey(d: Date): string {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

/** 'YYYY-MM-DD' → Date（その日の0時） */
export function fromKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key: string, days: number): string {
  const d = fromKey(key);
  d.setDate(d.getDate() + days);
  return toKey(d);
}

/** b - a の日数（a, b は 'YYYY-MM-DD'） */
export function diffDays(a: string, b: string): number {
  const da = fromKey(a);
  const db = fromKey(b);
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

/** 実在する日付か */
export function isValidDate(y: number, m: number, d: number): boolean {
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

/** '10/31（金）' の形 */
export function formatMDW(key: string): string {
  const d = fromKey(key);
  return `${d.getMonth() + 1}/${d.getDate()}（${WEEK[d.getDay()]}）`;
}

/** '10/31' の形 */
export function formatMD(key: string): string {
  const d = fromKey(key);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

/**
 * 残りの日数の言葉。
 * 予定：「今日」「明日」「3日後」／それ以外：「今日まで」「明日まで」「あと3日」／過ぎたもの：「期限切れ」
 */
export function dueLabel(dueKey: string, todayKey: string, isEvent: boolean): string {
  const n = diffDays(todayKey, dueKey);
  if (n < 0) return '期限切れ';
  if (isEvent) {
    if (n === 0) return '今日';
    if (n === 1) return '明日';
    return `${n}日後`;
  }
  if (n === 0) return '今日まで';
  if (n === 1) return '明日まで';
  return `あと${n}日`;
}
