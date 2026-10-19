// 文字の読み取りの差し替え口。仮版（tesseract.js）と、将来の本物のAIを同じ形で切り替える。

export type OcrResult =
  | { ok: true; text: string }
  /** unavailable＝読み取りのしくみが使えない（古いブラウザ・スマホ版の準備中・読み込み失敗） */
  | { ok: false; reason: 'unavailable' | 'error' };

export interface OcrEngine {
  /** 画面に出す名前 */
  name: string;
  /** 読み取る。image は Web では Blob、スマホではファイルの場所 */
  recognize(image: Blob | string): Promise<OcrResult>;
}
