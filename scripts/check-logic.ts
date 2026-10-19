// 共有部分（データ処理・日付・仮版の分解）の動作チェック。自動化の中で毎回実行される。
import { reducer } from '../src/state/reducer';
import { createInitialData } from '../src/domain/types';
import { currentStep, laterTasks, routinesDoneToday } from '../src/domain/selectors';
import { minutesUntil, normalizeTime, visitsThisWeek, weekStartKey, formatClock, formatRemaining } from '../src/domain/date';
import { ruleBasedBreakdown } from '../src/services/breakdown/ruleBased';
let failed = 0;
const assert = (c: any, m: string) => { if (!c) { console.log('FAIL', m); failed++; } else console.log('ok', m); };
let d = createInitialData();
d = reducer(d, { type: 'ADD_TASK', title: '数学の課題プリント' });
d = reducer(d, { type: 'ADD_TASK', title: '部屋の片付け' });
d = reducer(d, { type: 'ADD_TASK', title: '  ' });
assert(d.tasks.length === 2, 'empty title ignored');
assert(currentStep(d)!.label === '数学の課題プリント', 'no steps -> task is step');
const id = d.tasks[0].id;
d = reducer(d, { type: 'SET_STEPS', id, steps: ruleBasedBreakdown({ title: '数学の課題プリント', granularity: 'normal' }) });
assert(currentStep(d)!.label === '教材と筆記用具を机に出す' && currentStep(d)!.total === 5, 'study template');
d = reducer(d, { type: 'COMPLETE_CURRENT_STEP', id });
assert(currentStep(d)!.index === 1, 'next step');
for (let i = 0; i < 4; i++) d = reducer(d, { type: 'COMPLETE_CURRENT_STEP', id });
assert(d.tasks[0].done && currentStep(d)!.task.title === '部屋の片付け', 'task done -> next task current');
d = reducer(d, { type: 'ADD_TASK', title: 'C' });
const cId = d.tasks[2].id;
d = reducer(d, { type: 'MOVE_TASK', id: cId, dir: -1 });
assert(d.tasks[0].title === 'C', 'move among open tasks');
assert(laterTasks(d).length === 1, 'later count');
d = reducer(d, { type: 'TOGGLE_ROUTINE', routineId: 'r-teeth', date: '2026-10-19' });
assert(routinesDoneToday(d, new Date(2026, 9, 19)).length === 1, 'routine today');
assert(routinesDoneToday(d, new Date(2026, 9, 20)).length === 0, 'routine resets next day');
assert(normalizeTime('8:5') === '08:05' && normalizeTime('0815') === '08:15' && normalizeTime('25:00') === null && normalizeTime('8：15') === '08:15', 'normalize');
console.log(normalizeTime('8:5'), normalizeTime('0815'), normalizeTime('25:00'), normalizeTime('8：15'));
assert(minutesUntil('09:00', new Date(2026, 9, 19, 8, 18, 30)) === 41, 'minutesUntil');
assert(weekStartKey(new Date(2026, 9, 25)) === '2026-10-19', 'week start sunday->monday');
assert(visitsThisWeek(['2026-10-12', '2026-10-19', '2026-10-20'], new Date(2026, 9, 20)) === 2, 'visits');
assert(formatClock(92) === '1:32', 'clock');
assert(formatRemaining(42).num === '42' && formatRemaining(42).unit === '分', 'remaining minutes');
assert(formatRemaining(135).num === '2' && formatRemaining(135).rest === '15分', 'remaining hours');
['宿題','LINEの返信','明日の準備','ギター練習'].forEach(t => console.log(t, ruleBasedBreakdown({ title: t, granularity: 'rough' }).map(s => s.label).join(' / ')));

{
  let e = createInitialData();
  assert(e.onboarded === false, 'first time shows guide');
  e = reducer(e, { type: 'ADD_TASK', title: '自分のタスク' });
  e = reducer(e, { type: 'LOAD_SAMPLE' });
  assert(e.onboarded === true && e.tasks.length === 4 && e.tasks[0].title.startsWith('（見本）'), 'sample loads before own tasks');
  assert(currentStep(e)!.total === 3, 'sample first task has steps');
}
if (failed > 0) throw new Error(`${failed} check(s) failed`);
