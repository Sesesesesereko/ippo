// 書き出したWeb版を実際のブラウザで開き、主な操作を試して画面を撮影する（自動化用）。
// 結果の画像は ci-screens/ に保存される。エラーが出たら失敗にする。
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const dist = path.resolve('dist');
const base = '/' + ((process.env.GITHUB_REPOSITORY || '/ippo').split('/')[1] || 'ippo');
const outDir = path.resolve('ci-screens');
fs.mkdirSync(outDir, { recursive: true });
const URL0 = `http://localhost:4173${base}/`;

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ico': 'image/x-icon', '.json': 'application/json', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.startsWith(base)) p = p.slice(base.length) || '/';
  let file = path.join(dist, p);
  if (!file.startsWith(dist) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(dist, 'index.html');
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(4173, r));

const browser = await chromium.launch();
const errors = [];
const TZ = 'Asia/Tokyo';

async function newPage() {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'ja-JP', timezoneId: TZ });
  const page = await context.newPage();
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (/favicon|Failed to load resource/i.test(t)) return;
    errors.push(`console: ${t}`);
  });
  return { context, page };
}

const { page } = await newPage();

const shot = (name) => page.screenshot({ path: path.join(outDir, `${name}.png`) });
const step = async (name, fn) => {
  try {
    await fn();
    console.log(`ok   ${name}`);
  } catch (e) {
    errors.push(`step "${name}": ${String(e.message).split('\n')[0]}`);
    console.log(`FAIL ${name}\n     ${String(e.message).split('\n')[0]}`);
    await page.screenshot({ path: path.join(outDir, `fail-${name.replace(/[^\p{L}\p{N}]+/gu, '_')}.png`) }).catch(() => {});
  }
};
/** 見えている要素だけを探す（Stack では奥の画面も残るため） */
const vis = (text, exact = true) => page.getByText(text, { exact }).filter({ visible: true }).first();
const btn = (name, exact = true) => page.getByRole('button', { name, exact }).filter({ visible: true }).first();
const gone = async (text, exact = true) => {
  await page.getByText(text, { exact }).filter({ visible: true }).first().waitFor({ state: 'hidden', timeout: 8000 });
};
/** もどる（Stack では奥の画面にも「もどる」が残るので、一番手前＝最後のものを押し、住所が変わるのを待つ） */
const back = async () => {
  const before = page.url();
  await page.getByRole('button', { name: 'もどる', exact: true }).filter({ visible: true }).last().click();
  await page.waitForURL((u) => u.toString() !== before, { timeout: 8000 });
};

// 日付（ブラウザと同じ時刻帯で数える）
const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' });
const todayKey = fmt.format(new Date());
const addDays = (n) => {
  const [y, m, d] = todayKey.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
};

/** 押せる部分が 44px 以上か、藍色の塗りつぶしが1つ以下か */
async function checkLayout(screenName) {
  const r = await page.evaluate(() => {
    const small = [];
    for (const el of document.querySelectorAll('[role="button"],[role="search"],a[href]')) {
      const b = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      if (b.width === 0 || b.height === 0 || st.visibility === 'hidden') continue;
      if (b.bottom < 0 || b.top > window.innerHeight * 3) continue;
      if (el.closest('[aria-hidden="true"]')) continue;
      if (b.width < 43.5 || b.height < 43.5) small.push(`${(el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 20)} ${Math.round(b.width)}x${Math.round(b.height)}`);
    }
    let indigo = 0;
    for (const el of document.querySelectorAll('div')) {
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) continue;
      if (getComputedStyle(el).backgroundColor === 'rgb(52, 65, 140)' && b.height >= 40) indigo++;
    }
    return { small, indigo };
  });
  if (r.small.length) throw new Error(`${screenName}: 44px 未満の押せる部分: ${r.small.join(', ')}`);
  if (r.indigo > 1) throw new Error(`${screenName}: 藍色の塗りつぶしボタンが ${r.indigo} 個`);
}

// ---------- テスト用の画像を作る ----------
const imgDir = path.join(outDir, '_input');
fs.mkdirSync(imgDir, { recursive: true });
const couponPng = path.join(imgDir, 'coupon.png');
const blankPng = path.join(imgDir, 'blank.png');
const brokenPng = path.join(imgDir, 'broken.png');
{
  const p = await browser.newPage({ viewport: { width: 900, height: 600 } });
  await p.setContent(`<html><body style="margin:0;background:#fff;font-family:'Noto Sans CJK JP','Noto Sans JP',sans-serif;color:#000">
    <div style="padding:60px 50px;font-size:64px;font-weight:700;line-height:1.6">クーポン 20%OFF<br>有効期限 2026年12月31日</div></body></html>`);
  await p.screenshot({ path: couponPng });
  await p.setContent('<html><body style="margin:0;background:#fff"></body></html>');
  await p.screenshot({ path: blankPng });
  await p.close();
  fs.writeFileSync(brokenPng, 'this is not an image');
}

// ---------- 初回・見本 ----------
await step('初めて開くと はじめて画面が出る', async () => {
  await page.goto(URL0);
  await vis('スクショを入れると、種類ごとに分けて、期限をお知らせします').waitFor({ timeout: 30000 });
  await vis('今は試作の仮版です。読み取りはまちがいが多めです。あとで直せます。').waitFor();
  await shot('01-welcome');
  await checkLayout('はじめて画面');
});

await step('見本で試す で見本6件が入る', async () => {
  await btn('見本で試す').click();
  await vis('【見本】パン屋 こむぎ堂').waitFor({ timeout: 10000 });
  await vis('【見本】ゴミ出しの日').waitFor();
  await vis('見本').waitFor();
  await vis('すべて 6').waitFor();
});

await step('見本のクーポンと予定が「期限が近いもの」に出る', async () => {
  await vis('期限が近いもの').waitFor();
  await page.getByRole('button', { name: '【見本】カフェ ことり 100円引き あと2日' }).filter({ visible: true }).first().waitFor({ timeout: 5000 });
  await page.getByRole('button', { name: '【見本】ライブ ひかりホール 5日後' }).filter({ visible: true }).first().waitFor({ timeout: 5000 });
  await vis('データはこのブラウザの中だけにあります').waitFor();
  await shot('02-home-sample');
  await checkLayout('ホーム');
});

await step('一言の案内が「わかった」で消え、再読み込みしても出ない', async () => {
  await vis('カードを押すと、種類や期限を直せます').waitFor();
  await btn('わかった').click();
  await gone('カードを押すと、種類や期限を直せます');
  await page.reload();
  await vis('【見本】パン屋 こむぎ堂').waitFor({ timeout: 30000 });
  if (await vis('スクショを入れると、種類ごとに分けて、期限をお知らせします').isVisible()) throw new Error('はじめて画面がまた出た');
  if (await vis('カードを押すと、種類や期限を直せます').isVisible()) throw new Error('案内がまた出た');
});

await step('「仮版」の印を押すと説明が出る', async () => {
  await btn('仮版について').click();
  await vis('今は試作の仮版です').waitFor();
  await page.waitForTimeout(600);
  await vis('お知らせ（通知）はスマホ版でつきます。今はホームの一番上に、期限が近いものを出します').waitFor();
  await shot('03-provisional');
  await btn('とじる').click();
  await gone('今は試作の仮版です');
});

await step('種類の列でしぼり込む', async () => {
  await btn('レシピ 1').click();
  await vis('【見本】10分 親子丼').waitFor();
  if (await vis('【見本】パン屋 こむぎ堂').isVisible()) throw new Error('しぼり込まれていない');
  await btn('すべて 6').click();
  await vis('【見本】パン屋 こむぎ堂').waitFor();
});

// ---------- 探す ----------
await step('探す：くーぽん でクーポンが見つかる', async () => {
  await page.getByRole('search').filter({ visible: true }).first().click();
  const input = page.locator('input[aria-label="さがす"]').filter({ visible: true }).first();
  await input.waitFor({ timeout: 5000 });
  await vis('種類から探す').waitFor();
  await input.fill('くーぽん');
  await vis('件見つかりました', false).waitFor();
  await vis('【見本】カフェ ことり 100円引き').waitFor();
  await input.fill('駅');
  await vis('1件見つかりました').waitFor();
  await vis('【見本】パン屋 こむぎ堂').waitFor();
  await shot('04-search');
  await input.fill('ラーメン');
  await vis('『ラーメン』は見つかりませんでした').waitFor();
  await shot('05-search-none');
  await back();
  await vis('期限が近いもの').waitFor();
});

// ---------- くわしく画面 ----------
await step('くわしく画面で種類を変えると、ホームの件数も変わる', async () => {
  await btn('【見本】カフェ ことり 100円引き').click();
  await vis('使える期限').waitFor({ timeout: 5000 });
  await shot('06-item');
  await checkLayout('くわしく画面');
  await btn('お店・場所').click();
  await vis('保存しました').waitFor();
  await vis('期限').waitFor();
  await back();
  await vis('お店・場所 2').waitFor();
  await vis('クーポン 0').waitFor();
  await btn('クーポン 0').click();
  await vis('クーポンはまだありません').waitFor();
  await btn('すべて 6').click();
  await btn('【見本】カフェ ことり 100円引き').click();
  await btn('クーポン').click();
  await vis('使える期限').waitFor();
  await vis('あと2日').waitFor();
  await back();
  await vis('クーポン 1').waitFor();
});

await step('期限の候補・なし・日付を選ぶ が効く', async () => {
  await btn('【見本】ライブ ひかりホール').click();
  await vis('日にち').waitFor();
  await vis('5日後').waitFor();
  const chips = page.getByRole('button', { name: /^\d{1,2}\/\d{1,2}（.）$/ }).filter({ visible: true });
  if ((await chips.count()) !== 2) throw new Error(`候補の数が ${await chips.count()}`);
  await chips.nth(1).click();
  await vis('12日後').waitFor();
  await btn('なし').click();
  await gone('12日後');
  await page.locator('input[type="date"]').filter({ visible: true }).first().fill(addDays(3));
  await vis('3日後').waitFor();
});

await step('タイトルを書き直す', async () => {
  const t = page.locator('input[aria-label="タイトル"]').filter({ visible: true }).first();
  await t.fill('ライブ 友だちと');
  await t.press('Enter');
  await vis('保存しました').waitFor();
  await back();
  await vis('ライブ 友だちと').waitFor();
});

await step('「使った」で済んだものへ移り、「もとに戻す」で戻る', async () => {
  await btn('【見本】カフェ ことり 100円引き').click();
  await btn('使った').click();
  await vis('使ったにしました').waitFor();
  await vis('済んだもの（1）', false).waitFor();
  await shot('07-home-done-toast');
  await btn('もとに戻す').click();
  await gone('済んだもの（1）', false);
  await vis('【見本】カフェ ことり 100円引き').waitFor();
});

await step('済んだものは期限が近いものに出ず、「まだにもどす」で戻る', async () => {
  await btn('【見本】カフェ ことり 100円引き').click();
  await btn('使った').click();
  await vis('済んだもの（1）', false).waitFor();
  if (await page.getByRole('button', { name: '【見本】カフェ ことり 100円引き あと2日' }).filter({ visible: true }).count()) throw new Error('済んだものが期限が近いものに出ている');
  await btn('済んだもの（1）', false).click();
  await btn('【見本】カフェ ことり 100円引き').click();
  await btn('まだにもどす').click();
  await page.getByRole('button', { name: '【見本】カフェ ことり 100円引き あと2日' }).filter({ visible: true }).first().waitFor({ timeout: 5000 });
});

await step('消す：やめる では消えず、消す で消える', async () => {
  await btn('【見本】ゴミ出しの日').click();
  await btn('このスクショを消す').click();
  await vis('消しますか？').waitFor();
  await btn('やめる').click();
  await gone('消しますか？');
  await vis('種類').waitFor();
  await btn('このスクショを消す').click();
  await btn('消す').click();
  await vis('期限が近いもの').waitFor();
  await vis('すべて 5').waitFor();
  if (await vis('【見本】ゴミ出しの日').isVisible()) throw new Error('消えていない');
});

// ---------- スクショを追加して読み取り ----------
await step('スクショを追加すると、枚数分のカードが出る', async () => {
  const chooser = page.waitForEvent('filechooser', { timeout: 10000 });
  await btn('＋ スクショを追加').click();
  const fc = await chooser;
  if (!fc.isMultiple()) throw new Error('複数選べない');
  await fc.setFiles([couponPng, blankPng, brokenPng]);
  await vis('読み取り').waitFor({ timeout: 10000 });
  await vis('3枚中', false).waitFor();
  await vis('1枚 10秒ほどかかります。ほかの画面に行っても続きます').waitFor();
  await vis('この画像は開けませんでした').waitFor({ timeout: 15000 });
  await shot('08-import-reading');
  await checkLayout('読み取り画面');
});

await step('読み取りが終わり、種類と期限が入る', async () => {
  await vis('3枚中 3枚できた').waitFor({ timeout: 120000 });
  await vis('12/31（木）まで').waitFor({ timeout: 5000 });
  await vis('文字が読めませんでした。種類は自分で選べます').waitFor();
  await shot('09-import-done');
});

await step('「できた」でホームへ。見本を消すか1回だけ聞かれる', async () => {
  await btn('できた').click();
  await vis('見本を消しますか？').waitFor({ timeout: 8000 });
  await page.waitForTimeout(600);
  await shot('10-ask-remove-sample');
  await btn('のこす').click();
  await gone('見本を消しますか？');
  await vis('クーポン 2').waitFor();
});

await step('読み取った文字のくわしく画面', async () => {
  await page.locator('[data-testid^="card-s"]').filter({ visible: true }).filter({ hasText: '12/31' }).first().click();
  await vis('使える期限').waitFor();
  await btn('読み取った文字を見る').click();
  await vis('仮版なので、まちがいがあります').waitFor();
  await vis('2026年12月31日', false).waitFor();
  await shot('11-item-ocr');
  await back();
  await vis('期限が近いもの').waitFor();
});

await step('再読み込み後も残る（画像・直した内容）', async () => {
  await page.reload();
  await vis('ライブ 友だちと').waitFor({ timeout: 30000 });
  await vis('クーポン 2').waitFor();
  await vis('スクショ', false).waitFor();
  if (await vis('見本を消しますか？').isVisible()) throw new Error('見本の確認がまた出た');
  const loaded = await page.evaluate(() => [...document.images].filter((i) => i.src.startsWith('blob:') && i.naturalWidth > 0).length);
  if (loaded < 2) throw new Error(`保存した画像が表示されていない（${loaded}枚）`);
});

// ---------- メニュー ----------
await step('メニューとデータの説明', async () => {
  await btn('メニュー').click();
  await vis('データについて').waitFor();
  await vis('データはこのブラウザの中だけにあります').waitFor();
  await vis('ブラウザの記録を消す・別のブラウザで開く・長く使わないと、なくなることがあります').waitFor();
  await vis('今の量：スクショ 2枚（ほかに見本 5件）', false).waitFor();
  await shot('12-menu');
  await checkLayout('メニュー');
});

await step('見本を消すと見本だけ消える', async () => {
  await btn('見本を消す').click();
  await vis('見本をもう一度入れる').waitFor();
  await back();
  await vis('すべて 2').waitFor();
  if (await vis('ライブ 友だちと').isVisible()) throw new Error('見本が残っている');
});

await step('すべて消すと空のホームになる', async () => {
  await btn('メニュー').click();
  await btn('すべて消す').click();
  await vis('すべて消しますか？').waitFor();
  await page.getByRole('button', { name: 'すべて消す', exact: true }).filter({ visible: true }).last().click();
  await gone('すべて消しますか？');
  await back();
  await vis('まだスクショがありません').waitFor();
  await btn('見本で試す').waitFor();
  await shot('13-home-empty');
  await checkLayout('ホーム（空）');
});

await step('はじめて画面から「自分のスクショではじめる」→ 選ばずにやめると空のホーム', async () => {
  const { context, page: p2 } = await newPage();
  await p2.goto(URL0);
  await p2.getByText('自分のスクショではじめる', { exact: true }).waitFor({ timeout: 30000 });
  const chooser = p2.waitForEvent('filechooser', { timeout: 10000 });
  await p2.getByRole('button', { name: '自分のスクショではじめる' }).click();
  await chooser; // 何も選ばない
  await p2.getByText('まだスクショがありません', { exact: true }).filter({ visible: true }).first().waitFor({ timeout: 8000 });
  await context.close();
});

await browser.close();
server.close();
fs.rmSync(imgDir, { recursive: true, force: true });
fs.writeFileSync(path.join(outDir, 'result.txt'), errors.length ? errors.join('\n') + '\n' : 'ALL_OK\n');
if (errors.length) {
  console.log(errors.join('\n'));
  process.exit(1);
}
console.log('ALL_OK');
