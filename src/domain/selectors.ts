// 画面に出すための並べ替え・しぼり込み・探す。純粋な関数。
import { diffDays } from './dates';
import { normalizeForSearch } from './text';
import { Category, CATEGORY_LABEL, CATEGORY_ORDER, Item } from './types';

/** 新しく入れた順 */
export function byNewest(a: Item, b: Item): number {
  return a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : a.id < b.id ? 1 : -1;
}

/** 期限が近いもの：今日〜7日後で済んでいないもの。近い順 */
export function upcoming(items: Item[], todayKey: string): Item[] {
  return items
    .filter((i) => !i.done && i.dueDate && diffDays(todayKey, i.dueDate) >= 0 && diffDays(todayKey, i.dueDate) <= 7)
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : a.dueDate! > b.dueDate! ? 1 : byNewest(a, b)));
}

export function activeItems(items: Item[], category: Category | 'all' = 'all'): Item[] {
  return items.filter((i) => !i.done && (category === 'all' || i.category === category)).sort(byNewest);
}

export function doneItems(items: Item[]): Item[] {
  return items
    .filter((i) => i.done)
    .sort((a, b) => ((a.doneAt || '') < (b.doneAt || '') ? 1 : -1));
}

/** 種類ごとの件数（済んでいないもの） */
export function categoryCounts(items: Item[]): Record<Category | 'all', number> {
  const c = { all: 0, coupon: 0, event: 0, place: 0, want: 0, recipe: 0, other: 0 } as Record<Category | 'all', number>;
  for (const i of items) {
    if (i.done) continue;
    c.all++;
    c[i.category]++;
  }
  return c;
}

export interface SearchHit {
  item: Item;
  /** 見つかった文字のまわり（前・一致・後） */
  snippet: { before: string; match: string; after: string } | null;
}

/** 探す。対象：読み取った文字、タイトル、種類の名前 */
export function search(items: Item[], query: string): { active: SearchHit[]; done: SearchHit[] } {
  const q = normalizeForSearch(query);
  if (!q) return { active: [], done: [] };
  const hits: SearchHit[] = [];
  for (const item of items) {
    const fields = [item.title, CATEGORY_LABEL[item.category], item.ocrText];
    let matched = false;
    for (const f of fields) {
      if (normalizeForSearch(f).includes(q)) {
        matched = true;
        break;
      }
    }
    if (!matched) continue;
    hits.push({ item, snippet: makeSnippet(item.ocrText, q) });
  }
  hits.sort((a, b) => byNewest(a.item, b.item));
  return { active: hits.filter((h) => !h.item.done), done: hits.filter((h) => h.item.done) };
}

/** 元の文字のどこが一致したかを1行で見せる（そろえた文字の位置を元の文字に戻して探す） */
function makeSnippet(text: string, q: string): SearchHit['snippet'] {
  const oneLine = text.replace(/\s+/g, ' ');
  if (!oneLine) return null;
  // 元の文字の各位置から始めて、そろえた結果が q で始まる最短の部分を探す
  const chars = Array.from(oneLine);
  for (let s = 0; s < chars.length; s++) {
    if (/\s/.test(chars[s])) continue;
    let acc = '';
    for (let e = s; e < chars.length && e < s + q.length * 3 + 4; e++) {
      acc += chars[e];
      const n = normalizeForSearch(acc);
      if (n === q) {
        const before = chars.slice(Math.max(0, s - 10), s).join('');
        const after = chars.slice(e + 1, e + 11).join('');
        return {
          before: (s > 10 ? '…' : '') + before,
          match: chars.slice(s, e + 1).join(''),
          after: after + (e + 11 < chars.length ? '…' : ''),
        };
      }
      if (!q.startsWith(n)) break;
    }
  }
  return null;
}

/** 種類の名前で探したか（例：「くーぽん」→ coupon） */
export function categoryFromQuery(query: string): Category | null {
  const q = normalizeForSearch(query);
  for (const c of CATEGORY_ORDER) if (normalizeForSearch(CATEGORY_LABEL[c]) === q) return c;
  return null;
}
