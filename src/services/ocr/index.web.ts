// Web版の読み取り（仮版）。tesseract.js はアプリに同梱せず、使うときに CDN から読み込む（言語：日本語＋英語）。
import { OcrEngine, OcrResult } from './types';

export * from './types';

const SCRIPT_URL = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
const LANGS = ['jpn', 'eng'];

interface TesseractWorker {
  recognize(image: Blob | string): Promise<{ data: { text: string } }>;
  setParameters(p: Record<string, string>): Promise<unknown>;
}
interface TesseractGlobal {
  createWorker(langs: string | string[], oem?: number, options?: Record<string, unknown>): Promise<TesseractWorker>;
}

let scriptPromise: Promise<TesseractGlobal> | null = null;
let workerPromise: Promise<TesseractWorker> | null = null;

function loadScript(): Promise<TesseractGlobal> {
  if (!scriptPromise) {
    scriptPromise = new Promise<TesseractGlobal>((resolve, reject) => {
      const w = window as unknown as { Tesseract?: TesseractGlobal };
      if (w.Tesseract) {
        resolve(w.Tesseract);
        return;
      }
      if (typeof WebAssembly === 'undefined' || typeof Worker === 'undefined') {
        reject(new Error('unsupported'));
        return;
      }
      const s = document.createElement('script');
      s.src = SCRIPT_URL;
      s.async = true;
      s.crossOrigin = 'anonymous';
      s.onload = () => (w.Tesseract ? resolve(w.Tesseract) : reject(new Error('no Tesseract')));
      s.onerror = () => reject(new Error('script load failed'));
      document.head.appendChild(s);
    });
    scriptPromise.catch(() => {
      scriptPromise = null;
    });
  }
  return scriptPromise;
}

function getWorker(): Promise<TesseractWorker> {
  if (!workerPromise) {
    workerPromise = loadScript().then(async (T) => {
      const worker = await T.createWorker(LANGS, 1);
      // 日本語の文字の間に空白が入りにくくする
      await worker.setParameters({ preserve_interword_spaces: '1' }).catch(() => undefined);
      return worker;
    });
    workerPromise.catch(() => {
      workerPromise = null;
    });
  }
  return workerPromise;
}

export const ocrEngine: OcrEngine = {
  name: '仮版（tesseract.js）',
  async recognize(image: Blob | string): Promise<OcrResult> {
    let worker: TesseractWorker;
    try {
      worker = await getWorker();
    } catch {
      return { ok: false, reason: 'unavailable' };
    }
    try {
      const { data } = await worker.recognize(image);
      return { ok: true, text: data.text || '' };
    } catch {
      return { ok: false, reason: 'error' };
    }
  },
};
