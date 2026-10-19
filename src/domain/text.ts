// 文字のそろえ方（探す・読み取り結果の整理）。

/** カタカナ → ひらがな */
function kataToHira(s: string): string {
  return s.replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
}

/**
 * 探すときの言葉のそろえ方。
 * 全角／半角（NFKC）、大文字／小文字、ひらがな／カタカナの違いを同じとみなす。空白は取り除く。
 */
export function normalizeForSearch(s: string): string {
  return kataToHira(s.normalize('NFKC').toLowerCase()).replace(/\s+/g, '');
}

const WIDE = '[\\u3000-\\u30FF\\u3400-\\u9FFF\\uFF00-\\uFFEF々〆ー]';
const BETWEEN_WIDE = new RegExp(`(${WIDE})[ \\t]+(?=${WIDE})`, 'g');
const WIDE_DIGIT = new RegExp(`(${WIDE})[ \\t]+(?=[0-9])|([0-9])[ \\t]+(?=${WIDE})`, 'g');

/**
 * 読み取った文字の整理。
 * 全角英数を半角にし（NFKC）、日本語の文字の間に入りがちな余計な空白を取り除く。
 * 例：「ク ー ポ ン 2 0 % O F F」→「クーポン 20%OFF」に近づける。
 */
export function cleanOcrText(raw: string): string {
  let s = raw.normalize('NFKC').replace(/\r/g, '');
  // 日本語どうしの間の空白を消す（2回かけると「ク ー ポ」のような連続も消える）
  s = s.replace(BETWEEN_WIDE, '$1').replace(BETWEEN_WIDE, '$1');
  // 日本語と数字の間の空白を消す（「2026 年 12 月」→「2026年12月」）
  s = s.replace(WIDE_DIGIT, (_m, a, b) => a || b).replace(WIDE_DIGIT, (_m, a, b) => a || b);
  // 数字どうしの間の1つの空白（「2 0 %」）を消す。ただし「10/31 11/3」の区切りは残すため、1桁ずつの並びだけ
  s = s.replace(/\b(\d) (?=\d\b)/g, '$1');
  // 記号まわりの空白
  s = s.replace(/O ?F ?F/g, 'OFF');
  s = s.replace(/(\d) ?([%/:]) ?(?=\d)/g, '$1$2');
  s = s.replace(/(\d)\s*%\s*(OFF|off)/g, '$1%$2');
  return s
    .split('\n')
    .map((l) => l.trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
