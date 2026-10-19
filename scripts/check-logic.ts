// 共有部分（種類・期限・タイトルのルール、探す、データの変え方）の動作チェック。自動化の中で毎回実行される。
import { analyzeText, chooseDue, classify, fallbackTitle, findDates, hasMeaningfulText, titleFromText } from '../src/domain/rules';
import { addDays, dueLabel, formatMDW } from '../src/domain/dates';
import { cleanOcrText, normalizeForSearch } from '../src/domain/text';
import { categoryCounts, categoryFromQuery, doneItems, search, upcoming } from '../src/domain/selectors';
import { createSamples } from '../src/domain/sample';
import { afterLoad, createInitialState, newItem, reducer } from '../src/state/reducer';

let failed = 0;
const eq = (actual: unknown, expected: unknown, name: string) => {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) console.log('ok  ', name);
  else {
    failed++;
    console.log('FAIL', name, '\n     expected:', JSON.stringify(expected), '\n     actual:  ', JSON.stringify(actual));
  }
};

const TODAY = '2026-10-19';
const AT = '2026-10-19T03:00:00.000Z';

// 16. 種類を決めるルール
eq(classify('カフェ ことり\nドリンク100円引きクーポン\n有効期限 10/21まで'), 'coupon', '種類: クーポン');
eq(classify('ひかりホール公演\n10/24(土) 開場17:00 開演18:00'), 'event', '種類: 予定');
eq(classify('こむぎ堂\n営業時間 8:00〜18:00\n定休日 水曜\nみどり駅 徒歩3分'), 'place', '種類: お店・場所（時刻があってもお店の言葉が多い）');
eq(classify('キャンバススニーカー ホワイト\n¥5,980(税込)\nカートに入れる'), 'want', '種類: 買いたい物');
eq(classify('親子丼(1人分)\n材料:鶏もも肉、卵、玉ねぎ\n作り方'), 'recipe', '種類: レシピ');
eq(classify('燃えるゴミ 月・木\n資源ゴミ 第2水曜'), 'other', '種類: 手がかりが無ければその他');
eq(classify(''), 'other', '種類: 空ならその他');
eq(classify('クーポン 予約'), 'coupon', '種類: 同点は上の行を優先');
eq(classify('クーポン 20%OFF 有効期限 2026年12月31日'), 'coupon', '種類: テスト画像の文');
eq(classify('しょうゆ 大さじ2\n砂糖 小さじ1\n水 200ml'), 'recipe', '種類: 分量の形');

// 17. 日付の読み取り
const keys = (t: string, today = TODAY) => findDates(t, today).map((d) => d.key);
eq(keys('2026/10/31'), ['2026-10-31'], '日付: 2026/10/31');
eq(keys('2026年10月31日'), ['2026-10-31'], '日付: 2026年10月31日');
eq(keys('10/31'), ['2026-10-31'], '日付: 10/31');
eq(keys('10月31日'), ['2026-10-31'], '日付: 10月31日');
eq(keys('10月31日(金)'), ['2026-10-31'], '日付: 10月31日(金)');
eq(keys('１０月３１日（金）'), ['2026-10-31'], '日付: 全角数字');
eq(keys('9/25'), ['2026-09-25'], '日付: 年なしで30日未満前は今年');
eq(keys('9/18'), ['2027-09-18'], '日付: 年なしで30日以上前は来年');
eq(keys('2/30 13/1'), [], '日付: ありえない日付は読まない');
eq(keys('12:30 と 1,980円'), [], '日付: 時刻や値段は日付にしない');
eq(keys('開場 10/24 追加 11/3 2026-12-01'), ['2026-10-24', '2026-11-03', '2026-12-01'], '日付: 複数を順に');

// 18. 期限の選び方
{
  const t = '発行日 10/19\nご利用期限 10/31まで\n次回 11/15';
  eq(chooseDue(t, findDates(t, TODAY), 'coupon', TODAY), '2026-10-31', '期限: クーポンは「期限」「まで」に近い日付');
  const t2 = '10/20 10/25 11/2';
  eq(chooseDue(t2, findDates(t2, TODAY), 'coupon', TODAY), '2026-11-02', '期限: クーポンで手がかりが無ければ一番遅い日付');
  const t3 = '公演 10/10 10/24 11/3';
  eq(chooseDue(t3, findDates(t3, TODAY), 'event', TODAY), '2026-10-24', '期限: 予定は今日以降で一番早い日付');
  eq(chooseDue(t3, findDates(t3, TODAY), 'place', TODAY), null, '期限: それ以外の種類は自動で決めない');
  const a = analyzeText('クーポン 20%OFF\n有効期限 2026年12月31日', TODAY);
  eq([a.category, a.dueDate, a.dueCandidates], ['coupon', '2026-12-31', ['2026-12-31']], 'まとめ: テスト画像の文');
  const b = analyzeText('クーポン\nA 10/20\nB 10/21\nC 10/22\nD 10/23まで', TODAY);
  eq([b.dueDate, b.dueCandidates.length, b.dueCandidates.includes('2026-10-23')], ['2026-10-23', 3, true], '候補: 最大3つで期限は必ず入る');
}

// 19. タイトル
eq(titleFromText('abc\nカフェ ことり\nドリンク100円引きクーポン\n有効期限'), 'ドリンク100円引きクーポン', 'タイトル: 最初の5行で一番長い行');
eq(titleFromText('1\n2\n3\n4\n5\nこれは六行目の長い行です'), null, 'タイトル: 6行目以降は見ない');
eq(titleFromText('あいうえおかきくけこさしすせそたちつてとなにぬねの'), 'あいうえおかきくけこさしすせそたちつてと', 'タイトル: 20文字で切る');
eq(fallbackTitle('coupon', TODAY), 'クーポン 10/19', 'タイトル: 自動は「種類名 月/日」');
eq(analyzeText('abc', TODAY).title, 'その他 10/19', 'タイトル: 4文字以上の行が無ければ「種類名 月/日」');
eq(hasMeaningfulText('  .. | '), false, '文字が無いときは読めなかった扱い');

// 20. 探すときの言葉のそろえ方
eq(normalizeForSearch('くーぽん'), normalizeForSearch('クーポン'), 'そろえ方: ひらがな／カタカナ');
eq(normalizeForSearch('ｸｰﾎﾟﾝ'), normalizeForSearch('クーポン'), 'そろえ方: 半角カナ');
eq(normalizeForSearch('ＣＡＦＥ'), normalizeForSearch('cafe'), 'そろえ方: 全角／半角、大文字／小文字');
eq(categoryFromQuery('くーぽん'), 'coupon', '種類名で探す: くーぽん→クーポン');

// 読み取った文字の整理
eq(cleanOcrText('ク ー ポ ン 2 0 % O F F\n有 効 期 限 2026 年 12 月 31 日'), 'クーポン20%OFF\n有効期限2026年12月31日', '読み取り文字の空白を整える');
eq(analyzeText(cleanOcrText('ク ー ポ ン 2 0 % O F F\n有 効 期 限 2026 年 12 月 31 日'), TODAY).dueDate, '2026-12-31', '整えた文字から期限が読める');

// 日付の表示
eq(formatMDW('2026-10-31'), '10/31（土）', '表示: 10/31（土）');
eq([dueLabel(TODAY, TODAY, false), dueLabel(addDays(TODAY, 1), TODAY, false), dueLabel(addDays(TODAY, 3), TODAY, false), dueLabel(addDays(TODAY, -1), TODAY, false)], ['今日まで', '明日まで', 'あと3日', '期限切れ'], '表示: 期限の言葉');
eq([dueLabel(TODAY, TODAY, true), dueLabel(addDays(TODAY, 1), TODAY, true), dueLabel(addDays(TODAY, 3), TODAY, true)], ['今日', '明日', '3日後'], '表示: 予定の言葉');

// 見本と、データの変え方
{
  const now = new Date(2026, 9, 19, 12, 0, 0);
  let s = createInitialState();
  eq(s.settings.seenWelcome, false, '初回は はじめて画面');
  const own = newItem('own1', now, TODAY, 100, 100);
  s = reducer(s, { type: 'ADD_ITEM', item: own });
  s = reducer(s, { type: 'ADD_SAMPLES', items: createSamples(TODAY, now) });
  eq([s.items.length, s.items.filter((i) => i.isSample).length, s.settings.seenWelcome], [7, 6, true], '見本6件が入る');
  eq(s.items.filter((i) => i.isSample).every((i) => i.title.startsWith('【見本】')), true, '見本のタイトルは【見本】から');
  const up = upcoming(s.items, TODAY);
  eq(up.map((i) => [i.category, i.dueDate]), [['coupon', '2026-10-21'], ['event', '2026-10-24']], '期限が近いもの: 見本のクーポン(2日後)と予定(5日後)');
  eq(classify(s.items.find((i) => i.id.startsWith('sample-place'))!.ocrText), 'place', '見本の文字もルールで同じ種類になる');

  // 21. 種類の付け替え（件数も変わる）
  const coupon = s.items.find((i) => i.isSample && i.category === 'coupon')!;
  const before = categoryCounts(s.items);
  s = reducer(s, { type: 'SET_CATEGORY', id: coupon.id, category: 'want', at: AT, todayKey: TODAY });
  const after = categoryCounts(s.items);
  eq([before.coupon - 1, before.want + 1], [after.coupon, after.want], '種類を変えると件数が変わる');
  eq(s.items.find((i) => i.id === coupon.id)!.dueDate, null, '期限を直していなければ新しい種類のルールで選び直す');
  s = reducer(s, { type: 'SET_CATEGORY', id: coupon.id, category: 'coupon', at: AT, todayKey: TODAY });
  eq(s.items.find((i) => i.id === coupon.id)!.dueDate, '2026-10-21', 'クーポンに戻すと期限も戻る');

  // 22. 期限の変更
  s = reducer(s, { type: 'SET_DUE', id: coupon.id, due: null, at: AT });
  eq(upcoming(s.items, TODAY).length, 1, '期限「なし」で期限が近いものから外れる');
  s = reducer(s, { type: 'SET_DUE', id: coupon.id, due: '2026-10-21', at: AT });

  // 23. タイトル
  s = reducer(s, { type: 'SET_TITLE', id: own.id, title: '  ', at: AT, todayKey: TODAY });
  eq(s.items.find((i) => i.id === own.id)!.title, 'その他 10/19', 'タイトルを空にすると「種類名 月/日」');
  s = reducer(s, { type: 'SET_TITLE', id: own.id, title: '駅前のカフェ', at: AT, todayKey: TODAY });

  // 24. 人が直したものは読み取り結果で上書きしない
  s = reducer(s, { type: 'SET_CATEGORY', id: own.id, category: 'place', at: AT, todayKey: TODAY });
  s = reducer(s, { type: 'SET_DUE', id: own.id, due: '2026-11-11', at: AT });
  const text = 'クーポン 20%OFF\n有効期限 2026年12月31日';
  s = reducer(s, { type: 'APPLY_OCR', id: own.id, text, analysis: analyzeText(text, TODAY), at: AT, todayKey: TODAY });
  const o = s.items.find((i) => i.id === own.id)!;
  eq([o.status, o.title, o.category, o.dueDate, o.ocrText], ['ready', '駅前のカフェ', 'place', '2026-11-11', text], '人が直した種類・期限・タイトルは上書きされない');

  // 読み取り結果がそのまま入る
  const n2 = newItem('own2', now, TODAY, 100, 100);
  s = reducer(s, { type: 'ADD_ITEM', item: n2 });
  s = reducer(s, { type: 'APPLY_OCR', id: n2.id, text, analysis: analyzeText(text, TODAY), at: AT, todayKey: TODAY });
  const o2 = s.items.find((i) => i.id === n2.id)!;
  eq([o2.category, o2.dueDate, o2.title], ['coupon', '2026-12-31', '有効期限 2026年12月31日'], '読み取り結果が入る');

  // 12. 文字が読めない
  const n3 = newItem('own3', now, TODAY, 100, 100);
  s = reducer(s, { type: 'ADD_ITEM', item: n3 });
  s = reducer(s, { type: 'APPLY_OCR', id: n3.id, text: '', analysis: null, at: AT, todayKey: TODAY });
  const o3 = s.items.find((i) => i.id === n3.id)!;
  eq([o3.status, o3.category, o3.title, o3.failReason], ['failed', 'other', 'スクショ 10/19', 'noText'], '文字が読めなければその他「スクショ 月/日」');

  // 15. 途中で止まったもの
  const n4 = { ...newItem('own4', now, TODAY, 1, 1), status: 'reading' as const };
  s = reducer(s, { type: 'ADD_ITEM', item: n4 });
  eq(afterLoad(s).items.find((i) => i.id === 'own4')!.status, 'stopped', '読み込み時に読み取り中なら「止まりました」');

  // 25, 26. 使った・済んだ／もとに戻す
  s = reducer(s, { type: 'SET_DONE', id: coupon.id, done: true, at: AT });
  eq([doneItems(s.items).some((i) => i.id === coupon.id), upcoming(s.items, TODAY).some((i) => i.id === coupon.id)], [true, false], '使ったものは済んだものへ、期限が近いものに出ない');
  s = reducer(s, { type: 'SET_DONE', id: coupon.id, done: false, at: AT });
  eq(upcoming(s.items, TODAY).some((i) => i.id === coupon.id), true, 'もとに戻すと戻る');

  // 29-32. 探す
  eq(search(s.items, 'パン').active.map((h) => h.item.title), ['【見本】パン屋 こむぎ堂'], '探す: タイトル・読み取った文字');
  eq(search(s.items, 'くーぽん').active.some((h) => h.item.id === coupon.id), true, '探す: くーぽん でクーポンが見つかる');
  eq(search(s.items, 'ｸｰﾎﾟﾝ').active.some((h) => h.item.id === coupon.id), true, '探す: ｸｰﾎﾟﾝ でクーポンが見つかる');
  eq(search(s.items, 'お店・場所').active.length >= 2, true, '探す: 種類名で見つかる');
  eq(search(s.items, 'ラーメン').active.length, 0, '探す: 見つからない');
  eq(search(s.items, '徒歩').active[0].snippet, { before: '…日 水曜 みどり駅 ', match: '徒歩', after: '3分' }, '探す: 見つかった部分を見せる');
  s = reducer(s, { type: 'SET_DONE', id: coupon.id, done: true, at: AT });
  const r = search(s.items, 'ことり');
  eq([r.active.length, r.done.length], [0, 1], '探す: 済んだものは下にまとめる');

  // 5. 見本を消す
  s = reducer(s, { type: 'REMOVE_SAMPLES' });
  eq([s.items.filter((i) => i.isSample).length, s.items.length], [0, 4], '見本だけ消え、自分のスクショは残る');
  s = reducer(s, { type: 'DELETE', id: 'own4' });
  eq(s.items.length, 3, '1件消す');
  s = reducer(s, { type: 'CLEAR_ALL' });
  eq(s.items.length, 0, 'すべて消す');
}

// 34. 期限が近いもの：今日〜7日後だけ、近い順
{
  const now = new Date(2026, 9, 19, 12);
  const mk = (id: string, due: string | null) => ({ ...newItem(id, now, TODAY, 1, 1), status: 'ready' as const, dueDate: due });
  const items = [mk('a', addDays(TODAY, 8)), mk('b', addDays(TODAY, 3)), mk('c', TODAY), mk('d', addDays(TODAY, -1)), mk('e', addDays(TODAY, 7)), mk('f', null)];
  eq(upcoming(items, TODAY).map((i) => i.id), ['c', 'b', 'e'], '期限が近いもの: 範囲と順番');
}

if (failed > 0) {
  throw new Error(`${failed} 件失敗`);
}
console.log('\nすべて合格');
