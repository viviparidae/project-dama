export class DigitalSunset {
  private readonly enabled: boolean;
  private readonly sunsetTime: Date;

  constructor({
    enabled,
    sunsetTime,
  }: {
    enabled: boolean;
    sunsetTime: Date;
  }) {
    this.enabled = enabled;
    this.sunsetTime = sunsetTime;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * デジタルサンセット通知が必要かどうか
   * enabled===true かつ now >= sunsetTime の場合のみ true
   */
  shouldNotify(now: Date): boolean {
    return this.enabled === true && now >= this.sunsetTime;
  }

  getSunsetTime(): Date {
    return this.sunsetTime;
  }
}
