// アプリ全体で使うデータの形。Web版・スマホ版で共通。

export type Granularity = 'rough' | 'normal' | 'fine';

export interface Step {
  id: string;
  label: string;
  minutes: number;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  steps: Step[]; // 空なら、タスクそのものを1つの一歩として扱う
  done: boolean;
  createdAt: string; // ISO
}

export interface Routine {
  id: string;
  label: string;
}

export interface AppData {
  version: 1;
  tasks: Task[]; // 配列の順番 = 表示順。先頭の未完了タスクが「いま やる ひとつ」
  routines: Routine[];
  routineLog: Record<string, string[]>; // 日付(YYYY-MM-DD) -> その日にチェックした日課のid
  departure: { time: string | null; label: string }; // time: "HH:MM"
  visitDays: string[]; // アプリを開いた日(YYYY-MM-DD)
  noticeDismissed: boolean; // 保存についての案内を閉じたか
  onboarded: boolean; // 使い方の案内を見たか
}

export const DEFAULT_STEP_MINUTES = 5;

export function createInitialData(): AppData {
  return {
    version: 1,
    tasks: [],
    routines: [
      { id: 'r-teeth', label: '歯みがき' },
      { id: 'r-water', label: '水を飲む' },
      { id: 'r-bag', label: '持ち物を確認' },
    ],
    routineLog: {},
    departure: { time: null, label: '' },
    visitDays: [],
    noticeDismissed: false,
    onboarded: false,
  };
}
