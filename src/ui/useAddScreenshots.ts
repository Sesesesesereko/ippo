// 「＋ スクショを追加」：端末の画像選びを開き、選んだら読み取り画面へ。
import { router } from 'expo-router';
import { pickImages } from '../services/picker';
import { useApp } from '../state/AppState';

export function useAddScreenshots() {
  const { importImages } = useApp();
  return () => {
    // ボタンを押したその場で画像選びを開く（ブラウザの決まり）
    pickImages().then((files) => {
      if (files.length === 0) return; // 選ばずにやめたら元の画面のまま
      void importImages(files);
      router.push('/import');
    });
  };
}
