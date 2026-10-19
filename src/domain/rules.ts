// 仮版の「読み取り結果から 種類・期限・タイトル を決めるルール」。画面から切り離した純粋な関数。
// 本物のAIに替えるときは src/services/analyzer で差し替える。
import { addDays, diffDays, formatMD, isValidDate, pad2, toKey } from './dates';
import { Category, CATEGORY_LABEL, CATEGORY_ORDER } from './types';

// ---------- 種類 ----------

type Clue = string | RegExp;

/** 手がかりの言葉（同点は上の行を優先） */
export const CATEGORY_CLUES: Record<Exclude<Category, 'other'>, Clue[]> = {
  coupon: ['クーポン', '割引', '引き', '%OFF', 'OFF', '有効期限', '使用期限', '引換', 'ポイント', '提示'],
  event: ['開演', '開場', '日時', '予約', '集合', '公演', 'チケット', 'シフト', '受付', /(?<!\d)\d{1,2}:\d{2}(?!\d)/g],
  place: ['営業時間', '定休日', '住所', '〒', '駅', '徒歩', 'TEL', '電話', '地図', 'アクセス'],
  want: ['税込', '送料', 'カート', '購入', '在庫', 'サイズ', 'カラー', '¥', /\d{1,3}(,\d{3})+円|\d+円/g],
  recipe: ['材料', '作り方', '大さじ', '小さじ', '人分', '煮る', '炒める', /\d+(\.\d+)?\s?(g|ml|mL|cc)(?![a-zA-Z])/g],
};

function countOccurrences(text: string, clue: Clue): number {
  if (typeof clue === 'string') {
    if (!clue) return 0;
    let n = 0;
    let i = text.indexOf(clue);
    while (i >= 0) {
      n++;
      i = text.indexOf(clue, i + clue.length);
    }
    return n;
  }
  const re = new RegExp(clue.source, clue.flags.includes('g') ? clue.flags : clue.flags + 'g');
  return (text.match(re) || []).length;
}

/** 種類ごとの点数（手がかりの言葉の出てきた回数） */
export function categoryScores(text: string): Record<Category, number> {
  const t = text.normalize('NFKC');
  const scores: Record<Category, number> = { coupon: 0, event: 0, place: 0, want: 0, recipe: 0, other: 0 };
  for (const cat of CATEGORY_ORDER) {
    if (cat === 'other') continue;
    scores[cat] = CATEGORY_CLUES[cat].reduce((sum, c) => sum + countOccurrences(t, c), 0);
  }
  return scores;
}

/** 一番点数の高い種類。同点は上の行を優先。0なら「その他」 */
export function classify(text: string): Category {
  const scores = categoryScores(text);
  let best: Category = 'other';
  let bestScore = 0;
  for (const cat of CATEGORY_ORDER) {
    if (cat === 'other') continue;
    if (scores[cat] > bestScore) {
      best = cat;
      bestScore = scores[cat];
    }
  }
  return best;
}

// ---------- 日付 ----------

export interface FoundDate {
  key: string; // 'YYYY-MM-DD'
  index: number; // 文字の中の位置
  end: number;
}

/**
 * 文字の中から日付を探す。読む形：
 * 「2026/10/31」「2026-10-31」「2026年10月31日」「10/31」「10月31日」「10月31日(金)」
 * 年が無いときは今年とみなし、その日がすでに30日以上前なら来年とみなす。
 */
export function findDates(text: string, todayKey: string): FoundDate[] {
  const t = text.normalize('NFKC');
  const found: FoundDate[] = [];
  const used: Array<[number, number]> = [];
  const overlaps = (s: number, e: number) => used.some(([a, b]) => s < b && e > a);
  const todayYear = Number(todayKey.slice(0, 4));

  const full = /(?<!\d)(\d{4})\s*(?:[/.\-]|年)\s*(\d{1,2})\s*(?:[/.\-]|月)\s*(\d{1,2})(?!\d)\s*日?/g;
  let m: RegExpExecArray | null;
  while ((m = full.exec(t))) {
    const y = Number(m[1]);
    const mo = Number(m[2]);
    const d = Number(m[3]);
    if (y < 2000 || y > 2100 || !isValidDate(y, mo, d)) continue;
    found.push({ key: `${y}-${pad2(mo)}-${pad2(d)}`, index: m.index, end: m.index + m[0].length });
    used.push([m.index, m.index + m[0].length]);
  }

  const short = /(?<![\d/.])(\d{1,2})\s*(?:\/|月)\s*(\d{1,2})(?![\d/])\s*日?/g;
  while ((m = short.exec(t))) {
    const s = m.index;
    const e = s + m[0].length;
    if (overlaps(s, e)) continue;
    const mo = Number(m[1]);
    const d = Number(m[2]);
    if (!isValidDate(todayYear, mo, d) && !isValidDate(todayYear + 1, mo, d)) continue;
    let y = todayYear;
    if (!isValidDate(y, mo, d)) y = todayYear + 1; // 2/29 など
    let key = `${y}-${pad2(mo)}-${pad2(d)}`;
    if (diffDays(key, todayKey) >= 30) {
      const ny = y + 1;
      if (isValidDate(ny, mo, d)) key = `${ny}-${pad2(mo)}-${pad2(d)}`;
    }
    found.push({ key, index: s, end: e });
    used.push([s, e]);
  }

  return found.sort((a, b) => a.index - b.index);
}

const DEADLINE_WORDS = ['期限', 'まで'];

/** 期限にする日付を選ぶ。クーポン：「期限」「まで」に一番近い日付（無ければ一番遅い日付）、予定：今日以降で一番早い日付、それ以外：なし */
export function chooseDue(text: string, dates: FoundDate[], category: Category, todayKey: string): string | null {
  if (dates.length === 0) return null;
  if (category === 'coupon') {
    const t = text.normalize('NFKC');
    const marks: number[] = [];
    for (const w of DEADLINE_WORDS) {
      let i = t.indexOf(w);
      while (i >= 0) {
        marks.push(i);
        i = t.indexOf(w, i + w.length);
      }
    }
    if (marks.length > 0) {
      let best: FoundDate | null = null;
      let bestDist = Infinity;
      for (const d of dates) {
        for (const mk of marks) {
          const dist = mk >= d.end ? mk - d.end : mk < d.index ? d.index - mk : 0;
          if (dist < bestDist) {
            bestDist = dist;
            best = d;
          }
        }
      }
      if (best) return best.key;
    }
    return dates.map((d) => d.key).sort().slice(-1)[0];
  }
  if (category === 'event') {
    const future = dates.map((d) => d.key).filter((k) => diffDays(todayKey, k) >= 0).sort();
    return future[0] ?? null;
  }
  return null;
}

/** 候補（重複なし、最大3つ）。期限に選ばれた日は必ず入れる */
export function dueCandidates(dates: FoundDate[], due: string | null): string[] {
  const uniq: string[] = [];
  for (const d of dates) if (!uniq.includes(d.key)) uniq.push(d.key);
  let list = uniq.slice(0, 3);
  if (due && !list.includes(due)) list = [...list.slice(0, 2), due];
  return list;
}

// ---------- タイトル ----------

/** 自動のタイトル「クーポン 10/19」 */
export function fallbackTitle(category: Category, dayKey: string): string {
  return `${CATEGORY_LABEL[category]} ${formatMD(dayKey)}`;
}

/** 文字が読めなかったときのタイトル「スクショ 10/19」 */
export function noTextTitle(dayKey: string): string {
  return `スクショ ${formatMD(dayKey)}`;
}

/** 読み取った文字の最初の5行のうち、4文字以上で一番長い行（20文字で切る）。無ければ null */
export function titleFromText(text: string): string | null {
  const lines = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .slice(0, 5);
  let best: string | null = null;
  for (const l of lines) {
    if (Array.from(l).length < 4) continue;
    if (!best || Array.from(l).length > Array.from(best).length) best = l;
  }
  if (!best) return null;
  return Array.from(best).slice(0, 20).join('');
}

/** 意味のある文字（ひらがな・カタカナ・漢字・英数）が含まれているか */
export function hasMeaningfulText(text: string): boolean {
  const chars = text.match(/[\p{L}\p{N}]/gu) || [];
  return chars.length >= 2;
}

// ---------- まとめて ----------

export interface Analysis {
  category: Category;
  title: string;
  dueDate: string | null;
  dueCandidates: string[];
}

export function analyzeText(text: string, todayKey: string, createdKey: string = todayKey): Analysis {
  const category = classify(text);
  const dates = findDates(text, todayKey);
  const due = chooseDue(text, dates, category, todayKey);
  return {
    category,
    title: titleFromText(text) ?? fallbackTitle(category, createdKey),
    dueDate: due,
    dueCandidates: dueCandidates(dates, due),
  };
}

/** 人が種類を付け替えたときの期限の選び直し */
export function redoDue(text: string, category: Category, todayKey: string): string | null {
  return chooseDue(text, findDates(text, todayKey), category, todayKey);
}

export { addDays, toKey };
