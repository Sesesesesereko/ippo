// 日付の計算。端末の現地時刻で扱う。Web版・スマホ版で共通。

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function dayKey(d: Date = new Date()): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** 週の始まり（月曜）の日付キー */
export function weekStartKey(d: Date = new Date()): string {
  const copy = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = copy.getDay(); // 0=日
  const diff = dow === 0 ? 6 : dow - 1;
  copy.setDate(copy.getDate() - diff);
  return dayKey(copy);
}

/** 今週アプリを開いた日数（＝戻ってきた回数） */
export function visitsThisWeek(visitDays: string[], now: Date = new Date()): number {
  const start = weekStartKey(now);
  const today = dayKey(now);
  return new Set(visitDays.filter((k) => k >= start && k <= today)).size;
}

/** "HH:MM" として正しいか */
export function isValidTime(text: string): boolean {
  const m = /^(\d{1,2}):(\d{2})$/.exec(text.trim());
  if (!m) return false;
  const h = Number(m[1]);
  const min = Number(m[2]);
  return h >= 0 && h <= 23 && min >= 0 && min <= 59;
}

/** "8:5" や "0815" などを "08:15" に整える。無理なら null */
export function normalizeTime(text: string): string | null {
  const t = text.trim().replace('：', ':');
  let h: number;
  let m: number;
  if (/^\d{3,4}$/.test(t)) {
    h = Number(t.slice(0, t.length - 2));
    m = Number(t.slice(-2));
  } else {
    const match = /^(\d{1,2}):(\d{1,2})$/.exec(t);
    if (!match) return null;
    h = Number(match[1]);
    m = Number(match[2]);
  }
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return `${pad(h)}:${pad(m)}`;
}

/** 今から "HH:MM" までの分数。過ぎていればマイナス */
export function minutesUntil(time: string, now: Date = new Date()): number {
  const [h, m] = time.split(':').map(Number);
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
  return Math.floor((target.getTime() - now.getTime()) / 60000);
}

export function formatJapaneseDate(d: Date = new Date()): string {
  const w = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()];
  return `${d.getMonth() + 1}月${d.getDate()}日（${w}）`;
}

/** 秒数を "m:ss" に */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  return `${m}:${pad(s % 60)}`;
}

/** 残り分数を読みやすく：60分未満は「N分」、それ以上は「H時間M分」 */
export function formatRemaining(mins: number): { num: string; unit: string; rest?: string } {
  if (mins < 60) return { num: String(mins), unit: '分' };
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return { num: String(h), unit: '時間', rest: m > 0 ? `${m}分` : undefined };
}
