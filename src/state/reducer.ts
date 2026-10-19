// データの変更ルールをまとめた場所。画面に依存しないので、Web版・スマホ版で共通。
import { AppData, createInitialData, Step, Task } from '../domain/types';
import { dayKey } from '../domain/date';
import { currentTask } from '../domain/selectors';

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export type Action =
  | { type: 'LOAD'; data: AppData }
  | { type: 'ADD_TASK'; title: string }
  | { type: 'RENAME_TASK'; id: string; title: string }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'MOVE_TASK'; id: string; dir: -1 | 1 }
  | { type: 'MAKE_CURRENT'; id: string }
  | { type: 'CLEAR_DONE' }
  | { type: 'SET_STEPS'; id: string; steps: { label: string; minutes: number }[] }
  | { type: 'ADD_STEP'; id: string }
  | { type: 'UPDATE_STEP'; id: string; stepId: string; label?: string; minutes?: number }
  | { type: 'DELETE_STEP'; id: string; stepId: string }
  | { type: 'MOVE_STEP'; id: string; stepId: string; dir: -1 | 1 }
  | { type: 'COMPLETE_CURRENT_STEP'; id: string }
  | { type: 'TOGGLE_ROUTINE'; routineId: string; date?: string }
  | { type: 'ADD_ROUTINE'; label: string }
  | { type: 'DELETE_ROUTINE'; id: string }
  | { type: 'SET_DEPARTURE'; time: string | null; label?: string }
  | { type: 'RECORD_VISIT'; date?: string }
  | { type: 'DISMISS_NOTICE' }
  | { type: 'RESET_ALL' };

function move<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const to = index + dir;
  if (index < 0 || to < 0 || to >= list.length) return list;
  const copy = list.slice();
  const [item] = copy.splice(index, 1);
  copy.splice(to, 0, item);
  return copy;
}

function updateTask(data: AppData, id: string, fn: (t: Task) => Task): AppData {
  return { ...data, tasks: data.tasks.map((t) => (t.id === id ? fn(t) : t)) };
}

export function reducer(data: AppData, action: Action): AppData {
  switch (action.type) {
    case 'LOAD':
      return action.data;

    case 'ADD_TASK': {
      const title = action.title.trim();
      if (!title) return data;
      const task: Task = { id: newId('t'), title, steps: [], done: false, createdAt: new Date().toISOString() };
      return { ...data, tasks: [...data.tasks, task] };
    }

    case 'RENAME_TASK':
      return updateTask(data, action.id, (t) => ({ ...t, title: action.title }));

    case 'DELETE_TASK':
      return { ...data, tasks: data.tasks.filter((t) => t.id !== action.id) };

    case 'MOVE_TASK': {
      // 未完了タスクだけの並びの中で動かす
      const open = data.tasks.filter((t) => !t.done);
      const closed = data.tasks.filter((t) => t.done);
      const i = open.findIndex((t) => t.id === action.id);
      return { ...data, tasks: [...move(open, i, action.dir), ...closed] };
    }

    case 'MAKE_CURRENT': {
      const target = data.tasks.find((t) => t.id === action.id);
      if (!target) return data;
      const others = data.tasks.filter((t) => t.id !== action.id);
      return { ...data, tasks: [{ ...target, done: false }, ...others] };
    }

    case 'CLEAR_DONE':
      return { ...data, tasks: data.tasks.filter((t) => !t.done) };

    case 'SET_STEPS':
      return updateTask(data, action.id, (t) => ({
        ...t,
        steps: action.steps.map<Step>((s) => ({ id: newId('s'), label: s.label, minutes: s.minutes, done: false })),
      }));

    case 'ADD_STEP':
      return updateTask(data, action.id, (t) => ({
        ...t,
        steps: [...t.steps, { id: newId('s'), label: '', minutes: 5, done: false }],
      }));

    case 'UPDATE_STEP':
      return updateTask(data, action.id, (t) => ({
        ...t,
        steps: t.steps.map((s) =>
          s.id === action.stepId
            ? {
                ...s,
                label: action.label ?? s.label,
                minutes: action.minutes === undefined ? s.minutes : Math.min(180, Math.max(1, Math.round(action.minutes))),
              }
            : s,
        ),
      }));

    case 'DELETE_STEP':
      return updateTask(data, action.id, (t) => ({ ...t, steps: t.steps.filter((s) => s.id !== action.stepId) }));

    case 'MOVE_STEP':
      return updateTask(data, action.id, (t) => ({
        ...t,
        steps: move(t.steps, t.steps.findIndex((s) => s.id === action.stepId), action.dir),
      }));

    case 'COMPLETE_CURRENT_STEP':
      return updateTask(data, action.id, (t) => {
        if (t.steps.length === 0) return { ...t, done: true };
        const idx = t.steps.findIndex((s) => !s.done);
        if (idx === -1) return { ...t, done: true };
        const steps = t.steps.map((s, i) => (i === idx ? { ...s, done: true } : s));
        return { ...t, steps, done: steps.every((s) => s.done) };
      });

    case 'TOGGLE_ROUTINE': {
      const key = action.date ?? dayKey();
      const list = data.routineLog[key] ?? [];
      const next = list.includes(action.routineId)
        ? list.filter((id) => id !== action.routineId)
        : [...list, action.routineId];
      return { ...data, routineLog: { ...data.routineLog, [key]: next } };
    }

    case 'ADD_ROUTINE': {
      const label = action.label.trim();
      if (!label) return data;
      return { ...data, routines: [...data.routines, { id: newId('r'), label }] };
    }

    case 'DELETE_ROUTINE':
      return { ...data, routines: data.routines.filter((r) => r.id !== action.id) };

    case 'SET_DEPARTURE':
      return { ...data, departure: { time: action.time, label: action.label ?? data.departure.label } };

    case 'RECORD_VISIT': {
      const key = action.date ?? dayKey();
      if (data.visitDays.includes(key)) return data;
      // 古い記録は60日分だけ残す
      return { ...data, visitDays: [...data.visitDays, key].slice(-60) };
    }

    case 'DISMISS_NOTICE':
      return { ...data, noticeDismissed: true };

    case 'RESET_ALL':
      return createInitialData();

    default:
      return data;
  }
}

/** テストや確認用：いまのタスクを返す */
export { currentTask };
