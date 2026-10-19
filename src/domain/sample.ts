// 見本データ。日付は入れた日から数える（いつ試しても「期限が近いもの」に出るように）。
import { addDays, formatMD } from './dates';
import { Category, Item } from './types';

interface SampleDef {
  key: string;
  category: Category;
  title: string;
  lines: (d: (n: number) => string) => string[];
  due: number | null;
  candidates: number[];
}

const DEFS: SampleDef[] = [
  {
    key: 'coupon',
    category: 'coupon',
    title: '【見本】カフェ ことり 100円引き',
    lines: (d) => ['カフェ ことり', 'ドリンク100円引きクーポン', `有効期限 ${d(2)}まで`],
    due: 2,
    candidates: [2],
  },
  {
    key: 'event',
    category: 'event',
    title: '【見本】ライブ ひかりホール',
    lines: (d) => ['ひかりホール公演', `${d(5)} 開場17:00 開演18:00`, `追加公演 ${d(12)}`],
    due: 5,
    candidates: [5, 12],
  },
  {
    key: 'place',
    category: 'place',
    title: '【見本】パン屋 こむぎ堂',
    lines: () => ['こむぎ堂', '営業時間 8:00〜18:00', '定休日 水曜', 'みどり駅 徒歩3分'],
    due: null,
    candidates: [],
  },
  {
    key: 'want',
    category: 'want',
    title: '【見本】白いスニーカー',
    lines: () => ['キャンバススニーカー ホワイト', '¥5,980（税込）', 'カートに入れる'],
    due: null,
    candidates: [],
  },
  {
    key: 'recipe',
    category: 'recipe',
    title: '【見本】10分 親子丼',
    lines: () => ['親子丼（1人分）', '材料：鶏もも肉、卵、玉ねぎ', '作り方'],
    due: null,
    candidates: [],
  },
  {
    key: 'other',
    category: 'other',
    title: '【見本】ゴミ出しの日',
    lines: () => ['燃えるゴミ 月・木', '資源ゴミ 第2水曜'],
    due: null,
    candidates: [],
  },
];

/** 見本6件を作る。now は入れた日時 */
export function createSamples(todayKey: string, now: Date): Item[] {
  const d = (n: number) => formatMD(addDays(todayKey, n));
  return DEFS.map((def, idx) => {
    // 一覧で上の表の順に並ぶよう、作成時刻を少しずつずらす（新しい順に並ぶので逆向き）
    const t = new Date(now.getTime() - idx * 1000).toISOString();
    return {
      id: `sample-${def.key}-${now.getTime()}`,
      createdAt: t,
      updatedAt: t,
      hasImage: false,
      imageWidth: 0,
      imageHeight: 0,
      status: 'ready',
      ocrText: def.lines(d).join('\n'),
      title: def.title,
      category: def.category,
      dueDate: def.due === null ? null : addDays(todayKey, def.due),
      dueCandidates: def.candidates.map((n) => addDays(todayKey, n)),
      titleEdited: false,
      categoryEdited: false,
      dueEdited: false,
      done: false,
      doneAt: null,
      isSample: true,
    };
  });
}
