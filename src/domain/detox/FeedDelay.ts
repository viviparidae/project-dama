export class InvalidDelayHoursError extends Error {
  constructor(value: number) {
    super(`Invalid delayHours: ${value}. Must be one of [1, 3, 6, 24]`);
    this.name = "InvalidDelayHoursError";
  }
}

const VALID_DELAY_HOURS = [1, 3, 6, 24] as const;

export class FeedDelay {
  private readonly enabled: boolean;
  private readonly delayHours: 1 | 3 | 6 | 24;

  constructor({
    enabled,
    delayHours,
  }: {
    enabled: boolean;
    delayHours: 1 | 3 | 6 | 24;
  }) {
    if (!(VALID_DELAY_HOURS as readonly number[]).includes(delayHours)) {
      throw new InvalidDelayHoursError(delayHours);
    }
    this.enabled = enabled;
    this.delayHours = delayHours;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getStatus(): { delayActive: boolean; delayHours: number } {
    return {
      delayActive: this.enabled,
      delayHours: this.delayHours,
    };
  }

  isContentVisible(contentPublishedAt: Date, now: Date): boolean {
    return (
      now.getTime() - contentPublishedAt.getTime() >=
      this.delayHours * 3600 * 1000
    );
  }
}
