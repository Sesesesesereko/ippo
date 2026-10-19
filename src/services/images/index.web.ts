// Web版の画像：canvas で縮めて JPEG にし、IndexedDB に保存する（localStorage は容量が小さいため）。
import { fitSize, ImageError, JPEG_QUALITY, looksLikeHeic, OCR_LONG_SIDE, PickedImage, PreparedImage, STORE_LONG_SIDE } from './types';

export * from './types';

const DB_NAME = 'shot-images';
const STORE = 'images';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('no indexedDB'));
        return;
      }
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    dbPromise.catch(() => {
      dbPromise = null;
    });
  }
  return dbPromise;
}

function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> {
  return openDb().then(
    (db) =>
      new Promise<T | undefined>((resolve, reject) => {
        const t = db.transaction(STORE, mode);
        const req = fn(t.objectStore(STORE));
        let result: T | undefined;
        if (req) req.onsuccess = () => (result = req.result);
        t.oncomplete = () => resolve(result);
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
      }),
  );
}

const urlCache = new Map<string, string>();

export async function putImage(id: string, data: Blob | string): Promise<void> {
  try {
    await tx('readwrite', (s) => s.put(data, id));
  } catch (e) {
    const name = (e as DOMException | null)?.name || '';
    if (name === 'QuotaExceededError' || /quota/i.test(String((e as Error)?.message))) throw new ImageError('full');
    throw e;
  }
}

/** 画像を表示するための住所。無ければ null */
export async function getImageUri(id: string): Promise<string | null> {
  const cached = urlCache.get(id);
  if (cached) return cached;
  try {
    const blob = await tx<Blob>('readonly', (s) => s.get(id) as IDBRequest<Blob>);
    if (!blob) return null;
    const url = URL.createObjectURL(blob);
    urlCache.set(id, url);
    return url;
  } catch {
    return null;
  }
}

/** 読み取り用に保存済みの画像を取り出す（読み取り用の大きい画像が無いとき） */
export async function getImageData(id: string): Promise<Blob | string | null> {
  try {
    return (await tx<Blob>('readonly', (s) => s.get(id) as IDBRequest<Blob>)) ?? null;
  } catch {
    return null;
  }
}

export async function deleteImage(id: string): Promise<void> {
  const url = urlCache.get(id);
  if (url) URL.revokeObjectURL(url);
  urlCache.delete(id);
  try {
    await tx('readwrite', (s) => s.delete(id));
  } catch {
    // 消せなくても続ける
  }
}

export async function clearImages(): Promise<void> {
  urlCache.forEach((u) => URL.revokeObjectURL(u));
  urlCache.clear();
  try {
    await tx('readwrite', (s) => s.clear());
  } catch {
    // 続ける
  }
}

function loadImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('decode'));
    };
    img.src = url;
  });
}

function draw(img: HTMLImageElement, longSide: number): Promise<{ blob: Blob; width: number; height: number }> {
  const { width, height } = fitSize(img.naturalWidth, img.naturalHeight, longSide);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.reject(new Error('canvas'));
  // JPEG は透明を持てないので白で塗ってから描く
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve({ blob: b, width, height }) : reject(new Error('toBlob'))), 'image/jpeg', JPEG_QUALITY);
  });
}

/** 縮めて JPEG にする。開けない画像は ImageError を投げる */
export async function prepareImage(p: PickedImage): Promise<PreparedImage> {
  const file = p.file;
  if (!file) throw new ImageError('cannotOpen');
  let img: HTMLImageElement;
  try {
    img = await loadImage(file);
    if (!img.naturalWidth || !img.naturalHeight) throw new Error('empty');
  } catch {
    throw new ImageError(looksLikeHeic(p.name || file.name, p.mimeType || file.type) ? 'heic' : 'cannotOpen');
  }
  const stored = await draw(img, STORE_LONG_SIDE);
  const ocr = Math.max(img.naturalWidth, img.naturalHeight) > STORE_LONG_SIDE ? (await draw(img, OCR_LONG_SIDE)).blob : file;
  return { width: stored.width, height: stored.height, data: stored.blob, ocrSource: ocr };
}
