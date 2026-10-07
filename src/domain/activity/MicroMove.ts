/**
 * マイクロムーブを表すEntity
 * ユーザーが実施した短時間の体動記録
 */
export class MicroMove {
  readonly id: string;
  readonly userId: string;
  readonly completedAt: Date;

  private constructor({
    id,
    userId,
    completedAt,
  }: {
    id: string;
    userId: string;
    completedAt: Date;
  }) {
    this.id = id;
    this.userId = userId;
    this.completedAt = completedAt;
  }

  /**
   * 新しいMicroMoveを生成する静的ファクトリメソッド
   */
  static create({ userId }: { userId: string }): MicroMove {
    return new MicroMove({
      id: crypto.randomUUID(),
      userId,
      completedAt: new Date(),
    });
  }

  /**
   * プレーンオブジェクトとして返す
   */
  toRecord(): { id: string; userId: string; completedAt: Date } {
    return {
      id: this.id,
      userId: this.userId,
      completedAt: this.completedAt,
    };
  }
}
