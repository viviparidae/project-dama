/**
 * NEATスコアを表すValue Object
 * Non-Exercise Activity Thermogenesis (非運動性活動熱産生) の指標
 */
export class NEATScore {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  /**
   * NEATスコアを計算して返す
   * 計算式: (microMoveCount * 10) + floor(steps / 100) - (sedentaryBlocks * 5)
   * 最小値は0
   */
  static calculate({
    microMoveCount,
    steps,
    sedentaryBlocks,
  }: {
    microMoveCount: number;
    steps: number;
    sedentaryBlocks: number;
  }): NEATScore {
    const raw =
      microMoveCount * 10 + Math.floor(steps / 100) - sedentaryBlocks * 5;
    const clamped = Math.max(0, raw);
    return new NEATScore(clamped);
  }

  /**
   * スコア値を返す
   */
  getValue(): number {
    return this.value;
  }

  /**
   * スコアに対応するラベルを返す
   * >= 80: '優秀', >= 50: '良好', >= 20: '普通', < 20: '要改善'
   */
  getLabel(): string {
    if (this.value >= 80) return "優秀";
    if (this.value >= 50) return "良好";
    if (this.value >= 20) return "普通";
    return "要改善";
  }
}
