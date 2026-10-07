export class CircadianRecord {
  private readonly sunlightCheckedIn: boolean;
  private readonly checkedInAt: Date | undefined;

  constructor({
    sunlightCheckedIn,
    checkedInAt,
  }: {
    sunlightCheckedIn: boolean;
    checkedInAt?: Date;
  }) {
    this.sunlightCheckedIn = sunlightCheckedIn;
    this.checkedInAt = checkedInAt;
  }

  isSunlightCheckedIn(): boolean {
    return this.sunlightCheckedIn;
  }

  /**
   * 日光チェックインが未完了かつ現在時刻が9時以降の場合にリマインダーが必要
   */
  needsSunlightReminder(now: Date): boolean {
    return this.sunlightCheckedIn === false && now.getHours() >= 9;
  }

  getCheckedInAt(): Date | undefined {
    return this.checkedInAt;
  }
}
