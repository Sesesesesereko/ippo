// 仮版のタスク分解：決まったルール（キーワードとひな形）で分ける。
// 本物のAIではないので、内容に合わない分け方になることがある。
import { Granularity } from '../../domain/types';
import { BreakdownProvider, BreakdownRequest, ProposedStep } from './types';

type Template = Record<Granularity, ProposedStep[]>;

interface Rule {
  keywords: string[];
  build: (title: string) => Template;
}

const RULES: Rule[] = [
  {
    keywords: ['宿題', '課題', 'プリント', '勉強', 'レポート', 'テスト', 'ワーク', '問題'],
    build: () => ({
      rough: [
        { label: '教材と筆記用具を机に出す', minutes: 2 },
        { label: '半分まで進める', minutes: 20 },
        { label: '残りを終わらせて、カバンに入れる', minutes: 20 },
      ],
      normal: [
        { label: '教材と筆記用具を机に出す', minutes: 2 },
        { label: '名前を書いて、最初の問題を読むだけ', minutes: 3 },
        { label: '最初の3問を解く', minutes: 10 },
        { label: 'わからない問題に印をつける', minutes: 2 },
        { label: '残りを解いて、カバンに入れる', minutes: 15 },
      ],
      fine: [
        { label: '机の上を、教材が置ける分だけ空ける', minutes: 2 },
        { label: '教材と筆記用具を机に出す', minutes: 1 },
        { label: '名前を書く', minutes: 1 },
        { label: '最初の問題を読むだけ', minutes: 2 },
        { label: '最初の1問を解く', minutes: 5 },
        { label: '次の2問を解く', minutes: 8 },
        { label: 'わからない問題に印をつける', minutes: 2 },
        { label: '残りを解く', minutes: 15 },
        { label: 'カバンに入れる', minutes: 1 },
      ],
    }),
  },
  {
    keywords: ['片付け', '片づけ', '掃除', '部屋', '整理', '洗濯', '洗い物'],
    build: () => ({
      rough: [
        { label: 'ゴミだけ集めて捨てる', minutes: 5 },
        { label: '床にある物を元の場所に戻す', minutes: 10 },
        { label: '仕上げに、目につく所を整える', minutes: 10 },
      ],
      normal: [
        { label: 'ゴミ袋を1枚用意する', minutes: 1 },
        { label: '目に入るゴミだけ捨てる', minutes: 5 },
        { label: '床にある物を1か所に集める', minutes: 5 },
        { label: '集めた物を元の場所に戻す', minutes: 10 },
        { label: '最後に1か所だけ拭く', minutes: 3 },
      ],
      fine: [
        { label: 'ゴミ袋を1枚用意する', minutes: 1 },
        { label: '手の届く範囲のゴミを捨てる', minutes: 2 },
        { label: '部屋の残りのゴミを捨てる', minutes: 3 },
        { label: '床の服だけ1か所に集める', minutes: 3 },
        { label: '床の服以外を1か所に集める', minutes: 3 },
        { label: '集めた物を5個だけ戻す', minutes: 3 },
        { label: '残りを戻す', minutes: 8 },
        { label: '1か所だけ拭く', minutes: 3 },
      ],
    }),
  },
  {
    keywords: ['メール', '連絡', '返信', 'LINE', 'ライン', 'メッセージ', '電話'],
    build: () => ({
      rough: [
        { label: '相手からのメッセージを開いて読む', minutes: 3 },
        { label: '返事を書いて送る', minutes: 10 },
      ],
      normal: [
        { label: '相手からのメッセージを開く', minutes: 1 },
        { label: '何を聞かれているか、1行でメモする', minutes: 3 },
        { label: '返事の最初の1文だけ書く', minutes: 3 },
        { label: '残りを書いて送る', minutes: 7 },
      ],
      fine: [
        { label: 'アプリを開く', minutes: 1 },
        { label: '相手からのメッセージを読む', minutes: 2 },
        { label: '何を聞かれているか、1行でメモする', minutes: 2 },
        { label: '「返事が遅れてごめんね」など、最初の1文だけ書く', minutes: 2 },
        { label: '答えを書く', minutes: 5 },
        { label: '読み直して送る', minutes: 2 },
      ],
    }),
  },
  {
    keywords: ['準備', '持ち物', '買い物', '支度', '出かけ', '用意'],
    build: () => ({
      rough: [
        { label: '必要な物を思いつくだけ書き出す', minutes: 5 },
        { label: '書いた物をそろえる', minutes: 15 },
      ],
      normal: [
        { label: '必要な物を思いつくだけ書き出す', minutes: 5 },
        { label: '家にある物を1か所に集める', minutes: 10 },
        { label: '足りない物に印をつける', minutes: 2 },
        { label: 'カバンに入れる', minutes: 3 },
      ],
      fine: [
        { label: 'カバンを目の前に置く', minutes: 1 },
        { label: '必要な物を3つだけ書き出す', minutes: 2 },
        { label: '思いつく残りを書き出す', minutes: 3 },
        { label: '家にある物を1か所に集める', minutes: 10 },
        { label: '足りない物に印をつける', minutes: 2 },
        { label: 'カバンに入れる', minutes: 3 },
      ],
    }),
  },
];

function genericTemplate(title: string): Template {
  return {
    rough: [
      { label: `「${title}」に必要な物を手元に出す`, minutes: 3 },
      { label: '最初の10分だけ進める', minutes: 10 },
      { label: '続きを進めて、終わりを確認する', minutes: 20 },
    ],
    normal: [
      { label: `「${title}」に必要な物を手元に出す`, minutes: 3 },
      { label: '何をすれば終わりか、1行でメモする', minutes: 2 },
      { label: '最初の5分だけ手をつける', minutes: 5 },
      { label: '続きを進める', minutes: 15 },
      { label: '終わりを確認して片付ける', minutes: 5 },
    ],
    fine: [
      { label: `「${title}」をする場所に移動する`, minutes: 1 },
      { label: '必要な物を1つだけ手元に出す', minutes: 1 },
      { label: '残りの必要な物を出す', minutes: 2 },
      { label: '何をすれば終わりか、1行でメモする', minutes: 2 },
      { label: '最初の2分だけ手をつける', minutes: 2 },
      { label: '10分だけ続ける', minutes: 10 },
      { label: '残りを進める', minutes: 10 },
      { label: '終わりを確認して片付ける', minutes: 3 },
    ],
  };
}

export function ruleBasedBreakdown(req: BreakdownRequest): ProposedStep[] {
  const title = req.title.trim() || 'やること';
  const rule = RULES.find((r) => r.keywords.some((k) => title.includes(k)));
  const template = rule ? rule.build(title) : genericTemplate(title);
  return template[req.granularity].map((s) => ({ ...s }));
}

export const ruleBasedProvider: BreakdownProvider = {
  name: '仮版（ルールで分割）',
  isRealAI: false,
  async breakDown(req) {
    return ruleBasedBreakdown(req);
  },
};
