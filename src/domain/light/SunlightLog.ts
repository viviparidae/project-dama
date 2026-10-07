export class SunlightLog {
  private readonly userId: string;
  private readonly checkedInAt: Date;
  private readonly date: string;

  constructor({
    userId,
    checkedInAt,
    date,
  }: {
    userId: string;
    checkedInAt: Date;
    date: string;
  }) {
    this.userId = userId;
    this.checkedInAt = checkedInAt;
    this.date = date;
  }

  getUserId(): string {
    return this.userId;
  }

  getCheckedInAt(): Date {
    return this.checkedInAt;
  }

  getDate(): string {
    return this.date;
  }

  toRecord(): { userId: string; checkedInAt: Date; date: string } {
    return {
      userId: this.userId,
      checkedInAt: this.checkedInAt,
      date: this.date,
    };
  }
}
