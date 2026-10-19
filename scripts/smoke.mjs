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
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, locale: 'ja-JP' });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });

const shot = (name) => page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
const step = async (name, fn) => {
  try { await fn(); console.log(`ok   ${name}`); }
  catch (e) { errors.push(`step "${name}": ${e.message.split('\n')[0]}`); console.log(`FAIL ${name}`); }
};

await step('ホームが開く', async () => {
  await page.goto(`http://localhost:4173${base}/`);
  await page.getByText('おかえりなさい').waitFor({ timeout: 20000 });
  await shot('1-home-empty');
});
await step('保存の案内が出ている', async () => {
  await page.getByText('ブラウザの中だけに保存', { exact: false }).first().waitFor({ timeout: 5000 });
});
await step('出発時刻を入れる', async () => {
  await page.getByLabel('出発時刻').fill('23:59');
  await page.getByText('決める', { exact: true }).click();
  await page.getByText('出発まで').waitFor({ timeout: 5000 });
});
await step('やることを追加', async () => {
  await page.getByLabel('やることを追加').fill('数学の課題プリント');
  await page.getByText('追加', { exact: true }).click();
  await page.getByText('この一歩を、5分で').waitFor({ timeout: 5000 });
  await page.getByLabel('やることを追加').fill('部屋の片付け');
  await page.getByText('追加', { exact: true }).click();
});
await step('日課をチェック', async () => {
  await page.getByText('歯みがき', { exact: true }).click();
  await page.getByText('今日 1つ できた').waitFor({ timeout: 5000 });
  await shot('2-home-filled');
});
await step('小さく分ける（仮版）', async () => {
  await page.getByText('もっと細かくする', { exact: false }).click();
  await page.getByText('「仮版」です', { exact: false }).waitFor({ timeout: 5000 });
  await page.getByText('小さく分ける（仮版）').click();
  await page.getByText('教材と筆記用具を机に出す', { exact: false }).first().waitFor({ timeout: 5000 }).catch(async () => {
    await page.locator('input[value="教材と筆記用具を机に出す"]').waitFor({ timeout: 5000 });
  });
  await shot('3-breakdown');
});
await step('集中タイマー', async () => {
  await page.getByText('これを いま やる にして始める').click();
  await page.getByText('のこり').waitFor({ timeout: 5000 });
  await shot('4-focus');
});
await step('メモを置く', async () => {
  await page.getByLabel('気になったことのメモ').fill('明日の持ち物を確認');
  await page.getByText('置く', { exact: true }).click();
  await page.getByText('あとでやること に置きました', { exact: false }).waitFor({ timeout: 5000 });
});
await step('できたを押す', async () => {
  await page.getByText('できた', { exact: true }).click();
  await page.getByText('次の一歩').waitFor({ timeout: 5000 });
  await shot('5-done');
});
await step('再読み込みしてもデータが残る', async () => {
  await page.goto(`http://localhost:4173${base}/`);
  await page.getByText('おかえりなさい').waitFor({ timeout: 20000 });
  await page.getByText('名前を書いて', { exact: false }).waitFor({ timeout: 5000 });
});
await step('一覧で並べ替え', async () => {
  await page.getByText('一覧・並べ替え', { exact: false }).click();
  await page.getByText('やること一覧').waitFor({ timeout: 5000 });
  await shot('6-tasks');
});
await step('データについて', async () => {
  await page.getByLabel('戻る').click();
  await page.getByText('ブラウザ内だけに保存', { exact: false }).click();
  await page.getByText('データが消える・見えなくなる場合').waitFor({ timeout: 5000 });
  await shot('7-data');
});

await browser.close();
server.close();
fs.writeFileSync(path.join(outDir, 'result.txt'), errors.length ? errors.join('\n') + '\n' : 'ALL_OK\n');
if (errors.length) {
  console.log(errors.join('\n'));
  process.exit(1);
}
console.log('ALL_OK');
