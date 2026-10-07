/**
 * 座位継続ブロックを表すValue Object
 * 一定時間座りっぱなしの状態を追跡し、リマインドが必要かどうかを判定する
 */
export class SedentaryBlock {
  private readonly startedAt: Date;
  private readonly intervalMinutes: number;

  constructor({ startedAt, intervalMinutes }: { startedAt: Date; intervalMinutes: number }) {
    this.startedAt = startedAt;
    this.intervalMinutes = intervalMinutes;
  }

  /**
   * 指定時刻において、リマインドが必要かどうかを判定する
   * 経過時間がインターバル以上の場合にtrue
   */
  shouldRemind(now: Date): boolean {
    return this.getElapsedMinutes(now) >= this.intervalMinutes;
  }

  /**
   * 経過分数を返す
   */
  getElapsedMinutes(now: Date): number {
    return (now.getTime() - this.startedAt.getTime()) / 60000;
  }

  /**
   * 設定インターバル分数を返す
   */
  getIntervalMinutes(): number {
    return this.intervalMinutes;
  }
}
