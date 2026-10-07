/**
 * NOVAスコア（超加工度分類）バリューオブジェクト
 * NOVA分類はレベル1（未加工食品）〜レベル4（超加工食品）で定義される。
 */

export class InvalidNOVALevelError extends Error {
  constructor(level: number) {
    super(`NOVAレベルは1〜4の整数でなければなりません。受け取った値: ${level}`);
    this.name = "InvalidNOVALevelError";
  }
}

type NOVALevel = 1 | 2 | 3 | 4;

const RISK_DESCRIPTIONS: Record<NOVALevel, string> = {
  1: "未加工または最小限の加工食品です。健康的な選択肢です。",
  2: "調理済み食材です。適度に摂取することが推奨されます。",
  3: "加工食品です。添加物が含まれている場合があります。",
  4: "脳の報酬系を過剰に刺激する可能性があります",
};

export class NOVAScore {
  private readonly level: NOVALevel;

  constructor({ level }: { level: 1 | 2 | 3 | 4 }) {
    if (level < 1 || level > 4 || !Number.isInteger(level)) {
      throw new InvalidNOVALevelError(level);
    }
    this.level = level as NOVALevel;
  }

  getLevel(): number {
    return this.level;
  }

  /** レベル4（超加工食品）の場合にtrueを返す */
  isHighRisk(): boolean {
    return this.level === 4;
  }

  /** リスク説明文を返す */
  getRiskDescription(): string {
    return RISK_DESCRIPTIONS[this.level];
  }
}
