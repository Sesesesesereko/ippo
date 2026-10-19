// データから画面に出す値を取り出す計算。Web版・スマホ版で共通。
import { AppData, DEFAULT_STEP_MINUTES, Task } from './types';
import { dayKey } from './date';

/** 「いま やる ひとつ」のタスク（先頭の未完了） */
export function currentTask(data: AppData): Task | null {
  return data.tasks.find((t) => !t.done) ?? null;
}

export interface CurrentStepInfo {
  task: Task;
  stepId: string | null; // nullなら手順なし（タスク自体が一歩）
  label: string;
  minutes: number;
  index: number; // 0始まり
  total: number;
}

export function stepInfo(task: Task): CurrentStepInfo {
  if (task.steps.length === 0) {
    return { task, stepId: null, label: task.title, minutes: DEFAULT_STEP_MINUTES, index: 0, total: 1 };
  }
  const idx = task.steps.findIndex((s) => !s.done);
  const i = idx === -1 ? task.steps.length - 1 : idx;
  const s = task.steps[i];
  return { task, stepId: s.id, label: s.label, minutes: s.minutes, index: i, total: task.steps.length };
}

export function currentStep(data: AppData): CurrentStepInfo | null {
  const t = currentTask(data);
  return t ? stepInfo(t) : null;
}

/** 「あとでやること」＝いま以外の未完了タスク */
export function laterTasks(data: AppData): Task[] {
  const cur = currentTask(data);
  return data.tasks.filter((t) => !t.done && t.id !== cur?.id);
}

export function doneTasks(data: AppData): Task[] {
  return data.tasks.filter((t) => t.done);
}

export function routinesDoneToday(data: AppData, now: Date = new Date()): string[] {
  return data.routineLog[dayKey(now)] ?? [];
}
