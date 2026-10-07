/**
 * アクティビティリポジトリのインターフェース
 * マイクロムーブ設定・記録・サマリー取得を担う
 */
export interface IActivityRepository {
  /**
   * マイクロムーブ設定を保存する
   */
  saveMicroMoveSetting(setting: {
    userId: string;
    intervalMinutes: number;
    enabled: boolean;
  }): Promise<void>;

  /**
   * マイクロムーブ設定を取得する
   * 設定が存在しない場合はnullを返す
   */
  getMicroMoveSetting(
    userId: string
  ): Promise<{ intervalMinutes: number; enabled: boolean } | null>;

  /**
   * マイクロムーブを記録し、当日の実施回数を返す
   */
  recordMicroMove(entry: {
    userId: string;
    completedAt: Date;
  }): Promise<{ todayCount: number }>;

  /**
   * 指定日のアクティビティ日次サマリーを取得する
   * date は 'YYYY-MM-DD' 形式
   */
  getDailySummary(
    userId: string,
    date: string
  ): Promise<{
    sedentaryBlocks: number;
    microMoveCount: number;
    totalSedentaryMinutes: number;
  }>;

  /**
   * 直近週のNEATスコア一覧を取得する
   */
  getWeeklyNEATScores(
    userId: string
  ): Promise<Array<{ date: string; score: number }>>;
}
