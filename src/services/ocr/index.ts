// スマホ版の読み取り（準備中）。本物の読み取り（端末の文字認識やAI）はここに入れる。
// 今は「使えない」を返し、画面では「種類と期限は自分で選べます」と案内する。
import { OcrEngine, OcrResult } from './types';

export * from './types';

export const ocrEngine: OcrEngine = {
  name: '準備中',
  async recognize(): Promise<OcrResult> {
    return { ok: false, reason: 'unavailable' };
  },
};
