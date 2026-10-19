// どの分解方法を使うかをここで1か所だけ決める。
// 本物のAI版を作ったら、この1行を差し替えるだけで画面側は変更不要。
import { ruleBasedProvider } from './ruleBased';
import { BreakdownProvider } from './types';

export const breakdownProvider: BreakdownProvider = ruleBasedProvider;

export type { BreakdownProvider, BreakdownRequest, ProposedStep } from './types';
