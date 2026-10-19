// タスク分解の「差し替え口」。
// 今はルールで分ける仮版を使い、あとで本物のAI版に差し替える。
import { Granularity } from '../../domain/types';

export interface BreakdownRequest {
  title: string;
  granularity: Granularity;
}

export interface ProposedStep {
  label: string;
  minutes: number;
}

export interface BreakdownProvider {
  /** 画面に出す名前 */
  name: string;
  /** 本物のAIかどうか。false の間は画面に「仮版」と表示する */
  isRealAI: boolean;
  breakDown(req: BreakdownRequest): Promise<ProposedStep[]>;
}
