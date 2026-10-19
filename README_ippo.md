# いっぽ（試作版）

ADHD傾向のある人向けの生活サポートアプリの試作です。Expo＋React Native で作っており、Web版から始めて、将来は同じコードでiPhone・Android版に広げます。

## 動かし方（Web版）
1. このフォルダで `npm install`
2. `npx expo start --web`

## フォルダの役割
- `src/domain/` データの形と計算（Web・スマホ共通）
- `src/state/` データの変更ルールと保存の流れ（共通）
- `src/services/storage.ts` 保存。Webはブラウザ内、スマホは端末内（共通）
- `src/services/breakdown/` タスク分解の差し替え口。今は「仮版（ルール）」。本物のAI版を作ったら `index.ts` の1行を差し替える
- `src/screens/` 画面
- `src/navigation/Nav.tsx` 画面の切り替え（将来ここだけ Expo Router などに置き換え可能）

## 試作で後回しにしているもの
カレンダー連携、通知、課金、本物のAIによる分解。
