// Web版の画像選び。ブラウザのファイル選び（input type=file）を開き、選ばれた File を返す。
// 選ばずにやめたことはブラウザから確実には分からないので、呼ぶ側は「やめた」前提で画面を作る。
import { PickedImage } from '../images/types';

export function pickImages(): Promise<PickedImage[]> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.heic,.heif';
    input.multiple = true;
    input.style.display = 'none';
    input.setAttribute('data-testid', 'file-input');
    document.body.appendChild(input);
    const done = (files: PickedImage[]) => {
      input.remove();
      resolve(files);
    };
    input.addEventListener('change', () => {
      const list = Array.from(input.files || []);
      done(list.map((f) => ({ name: f.name, file: f, mimeType: f.type })));
    });
    input.addEventListener('cancel', () => done([]));
    input.click();
  });
}
