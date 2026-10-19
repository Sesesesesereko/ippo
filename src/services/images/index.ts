// スマホ版の画像：expo-image-manipulator で縮めて JPEG にし、そのファイルの場所を AsyncStorage に覚える。
// （試作の段階。正式版ではアプリ専用のフォルダへ移す）
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { ImageError, JPEG_QUALITY, OCR_LONG_SIDE, PickedImage, PreparedImage, STORE_LONG_SIDE } from './types';

export * from './types';

const key = (id: string) => `shot:img:${id}`;

export async function putImage(id: string, data: Blob | string): Promise<void> {
  if (typeof data !== 'string') throw new ImageError('cannotOpen');
  try {
    await AsyncStorage.setItem(key(id), data);
  } catch {
    throw new ImageError('full');
  }
}

export async function getImageUri(id: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key(id));
  } catch {
    return null;
  }
}

export async function getImageData(id: string): Promise<Blob | string | null> {
  return getImageUri(id);
}

export async function deleteImage(id: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key(id));
  } catch {
    // 続ける
  }
}

export async function clearImages(): Promise<void> {
  try {
    const keys = (await AsyncStorage.getAllKeys()).filter((k) => k.startsWith('shot:img:'));
    await AsyncStorage.multiRemove(keys);
  } catch {
    // 続ける
  }
}

async function resized(uri: string, longSide: number) {
  const ctx = ImageManipulator.manipulate(uri);
  const first = await ctx.renderAsync();
  const { width: w, height: h } = first;
  if (Math.max(w, h) > longSide) {
    ctx.resize(w >= h ? { width: longSide, height: null } : { width: null, height: longSide });
  }
  const ref = await ctx.renderAsync();
  return ref.saveAsync({ format: SaveFormat.JPEG, compress: JPEG_QUALITY });
}

export async function prepareImage(p: PickedImage): Promise<PreparedImage> {
  if (!p.uri) throw new ImageError('cannotOpen');
  try {
    const stored = await resized(p.uri, STORE_LONG_SIDE);
    const ocr = await resized(p.uri, OCR_LONG_SIDE);
    return { width: stored.width, height: stored.height, data: stored.uri, ocrSource: ocr.uri };
  } catch {
    throw new ImageError('cannotOpen');
  }
}
