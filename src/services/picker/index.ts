// スマホ版の画像選び（expo-image-picker）。
import * as ImagePicker from 'expo-image-picker';
import { PickedImage } from '../images/types';

export async function pickImages(): Promise<PickedImage[]> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    quality: 1,
  });
  if (result.canceled) return [];
  return result.assets.map((a, i) => ({ name: a.fileName ?? `image-${i}.jpg`, uri: a.uri, mimeType: a.mimeType ?? undefined }));
}
