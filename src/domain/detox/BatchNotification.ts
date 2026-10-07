export class TooManyBatchWindowsError extends Error {
  constructor() {
    super("Batch notification windows must not exceed 3");
    this.name = "TooManyBatchWindowsError";
  }
}

export class BatchNotification {
  private readonly enabled: boolean;
  private readonly windows: Array<{ hour: number; minute: number }>;

  constructor({
    enabled,
    windows,
  }: {
    enabled: boolean;
    windows: Array<{ hour: number; minute: number }>;
  }) {
    if (windows.length > 3) {
      throw new TooManyBatchWindowsError();
    }
    this.enabled = enabled;
    this.windows = windows;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  isValid(): boolean {
    return this.enabled && this.windows.length >= 1 && this.windows.length <= 3;
  }

  isInBatchWindow(now: Date): boolean {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Tokyo",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(now);
    const hour = Number(parts.find((part) => part.type === "hour")?.value ?? 0);
    const minute = Number(parts.find((part) => part.type === "minute")?.value ?? 0);

    return this.windows.some(
      (window) =>
        hour === window.hour && Math.abs(minute - window.minute) <= 5
    );
  }

  getWindows(): Array<{ hour: number; minute: number }> {
    return this.windows;
  }
}
