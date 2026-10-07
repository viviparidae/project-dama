import { IDetoxRepository } from "../../adapters/IDetoxRepository";

export class DeliverBatchSummary {
  constructor(private repo: IDetoxRepository) {}

  async execute({ userId }: { userId: string }): Promise<{
    count: number;
    notifications: Array<{ id: string; content: string }>;
  }> {
    const notifications = await this.repo.getPendingNotifications(userId);
    return { count: notifications.length, notifications };
  }

  async getWeeklySummary({ userId }: { userId: string }): Promise<{
    batchComplianceDays: number;
    feedDelayDays: number;
    blockedCount: number;
  }> {
    return this.repo.getWeeklySummary(userId);
  }
}
