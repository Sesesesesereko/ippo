// 画像の保存と下ごしらえの差し替え口（Web：IndexedDB と canvas、スマホ：端末のファイル）。

/** 端末から選んだ画像 */
export interface PickedImage {
  name: string;
  /** スマホ：ファイルの場所。Web：使わない */
  uri?: string;
  /** Web：ブラウザの File */
  file?: Blob & { name?: string; type?: string };
  mimeType?: string;
}

/** 縮めて保存できる形にした画像 */
export interface PreparedImage {
  width: number;
  height: number;
  /** 保存する画像（Web：JPEG の Blob、スマホ：ファイルの場所） */
  data: Blob | string;
  /** 読み取り用の少し大きい画像（読み取り後は捨てる） */
  ocrSource: Blob | string;
}

export type PrepareError = 'cannotOpen' | 'heic';

export class ImageError extends Error {
  constructor(public kind: PrepareError | 'full') {
    super(kind);
  }
}

/** 保存用の長い辺（ピクセル） */
export const STORE_LONG_SIDE = 1080;
/** 読み取り用の長い辺 */
export const OCR_LONG_SIDE = 1600;
export const JPEG_QUALITY = 0.7;

export function fitSize(w: number, h: number, longSide: number): { width: number; height: number } {
  const long = Math.max(w, h);
  if (long <= longSide) return { width: w, height: h };
  const r = longSide / long;
  return { width: Math.round(w * r), height: Math.round(h * r) };
}

export function looksLikeHeic(name: string | undefined, type: string | undefined): boolean {
  return /hei[cf]/i.test(type || '') || /\.(heic|heif)$/i.test(name || '');
}
