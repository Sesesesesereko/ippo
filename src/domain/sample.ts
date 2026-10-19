// 「見本を入れて試す」用のデータ。見本だと分かるように名前に（見本）を付ける。
import { Task } from './types';

let seq = 0;
const id = (p: string) => `${p}-sample-${Date.now().toString(36)}-${seq++}`;

export function sampleTasks(): Task[] {
  const now = new Date().toISOString();
  return [
    {
      id: id('t'),
      title: '（見本）数学の課題プリント',
      done: false,
      createdAt: now,
      steps: [
        { id: id('s'), label: '教材と筆記用具を机に出す', minutes: 2, done: false },
        { id: id('s'), label: '名前を書いて、最初の問題を読むだけ', minutes: 3, done: false },
        { id: id('s'), label: '最初の3問を解く', minutes: 10, done: false },
      ],
    },
    { id: id('t'), title: '（見本）部屋の片付け', done: false, createdAt: now, steps: [] },
    { id: id('t'), title: '（見本）友だちのLINEに返信', done: false, createdAt: now, steps: [] },
  ];
}
