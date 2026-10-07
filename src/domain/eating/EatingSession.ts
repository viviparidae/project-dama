/**
 * 食事セッション エンティティ
 * 食事タイマー（SatietyTimer）を管理し、開始・完了・キャンセルのライフサイクルを持つ。
 */

import { SatietyTimer } from "./SatietyTimer";

export type EatingSessionStatus = "idle" | "running" | "completed" | "cancelled";

export interface EatingSessionRecord {
  id: string;
  userId: string;
  status: EatingSessionStatus;
  startedAt: Date;
  completedAt?: Date;
  durationSeconds: number;
  remainingSeconds: number;
}

export class EatingSession {
  readonly id: string;
  readonly userId: string;
  readonly timer: SatietyTimer;
  private _status: EatingSessionStatus;
  readonly startedAt: Date;
  private _completedAt?: Date;

  private constructor({
    id,
    userId,
    timer,
    status,
    startedAt,
  }: {
    id: string;
    userId: string;
    timer: SatietyTimer;
    status: EatingSessionStatus;
    startedAt: Date;
  }) {
    this.id = id;
    this.userId = userId;
    this.timer = timer;
    this._status = status;
    this.startedAt = startedAt;
  }

  /** 新しい食事セッションを生成するファクトリメソッド */
  static create({ userId }: { userId: string }): EatingSession {
    return new EatingSession({
      id: crypto.randomUUID(),
      userId,
      timer: new SatietyTimer({ durationSeconds: 1200 }),
      status: "idle",
      startedAt: new Date(),
    });
  }

  get status(): EatingSessionStatus {
    return this._status;
  }

  get completedAt(): Date | undefined {
    return this._completedAt;
  }

  /** セッションを開始する */
  start(): void {
    this._status = "running";
    this.timer.start();
  }

  /** セッションを完了にする */
  complete(): void {
    this._status = "completed";
    this._completedAt = new Date();
  }

  /** セッションをキャンセルする（記録は保存されない） */
  cancel(): void {
    this._status = "cancelled";
    this.timer.cancel();
  }

  /** 永続化用のプレーンオブジェクトに変換する */
  toRecord(): EatingSessionRecord {
    return {
      id: this.id,
      userId: this.userId,
      status: this._status,
      startedAt: this.startedAt,
      completedAt: this._completedAt,
      durationSeconds: this.timer.durationSeconds,
      remainingSeconds: this.timer.getRemainingSeconds(),
    };
  }
}
