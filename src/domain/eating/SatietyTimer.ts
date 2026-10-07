/**
 * 満腹タイマー（満腹シグナル待機用カウントダウンタイマー）
 * デフォルト20分（1200秒）のカウントダウンを管理するバリューオブジェクト。
 */

export type SatietyTimerStatus = "idle" | "running" | "completed" | "cancelled";

export class SatietyTimer {
  readonly durationSeconds: number;
  private _status: SatietyTimerStatus;
  private _remainingSeconds: number;
  private _completedAt?: Date;

  constructor({ durationSeconds = 1200 }: { durationSeconds?: number } = {}) {
    this.durationSeconds = durationSeconds;
    this._status = "idle";
    this._remainingSeconds = durationSeconds;
  }

  /** タイマーを開始する */
  start(): void {
    this._status = "running";
  }

  /**
   * 経過秒数を加算してカウントダウンを進める。
   * 残り時間が0以下になったら完了状態に遷移する。
   */
  tick(elapsedSeconds: number): void {
    if (this._status !== "running") return;
    this._remainingSeconds -= elapsedSeconds;
    if (this._remainingSeconds <= 0) {
      this._remainingSeconds = 0;
      this._status = "completed";
      this._completedAt = new Date();
    }
  }

  /** タイマーをキャンセルする（記録は保存しない） */
  cancel(): void {
    this._status = "cancelled";
  }

  getStatus(): SatietyTimerStatus {
    return this._status;
  }

  getRemainingSeconds(): number {
    return this._remainingSeconds;
  }

  getCompletedAt(): Date | undefined {
    return this._completedAt;
  }
}
