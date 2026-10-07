export class DetoxLog {
  private readonly userId: string;
  private readonly type: "notification_blocked" | "feed_delayed";
  private readonly occurredAt: Date;

  constructor({
    userId,
    type,
    occurredAt,
  }: {
    userId: string;
    type: "notification_blocked" | "feed_delayed";
    occurredAt: Date;
  }) {
    this.userId = userId;
    this.type = type;
    this.occurredAt = occurredAt;
  }

  getUserId(): string {
    return this.userId;
  }

  getType(): "notification_blocked" | "feed_delayed" {
    return this.type;
  }

  getOccurredAt(): Date {
    return this.occurredAt;
  }

  toRecord(): {
    userId: string;
    type: "notification_blocked" | "feed_delayed";
    occurredAt: Date;
  } {
    return {
      userId: this.userId,
      type: this.type,
      occurredAt: this.occurredAt,
    };
  }
}
