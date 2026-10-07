/**
 * 食事セッション リポジトリ インターフェース
 */

import type { EatingSession } from "../domain/eating/EatingSession";

export interface IEatingRepository {
  /** セッションを保存する */
  save(session: EatingSession): Promise<void>;

  /** 指定ユーザーの本日完了したセッション一覧を返す */
  findTodayCompleted(userId: string): Promise<EatingSession[]>;
}
