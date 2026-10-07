export interface IDetoxRepository {
  saveBatchNotifySetting(setting: {
    userId: string;
    enabled: boolean;
    windows: Array<{ hour: number; minute: number }>;
  }): Promise<void>;

  getBatchNotifySetting(userId: string): Promise<{
    enabled: boolean;
    windows: Array<{ hour: number; minute: number }>;
  } | null>;

  getPendingNotifications(
    userId: string
  ): Promise<Array<{ id: string; content: string }>>;

  saveFeedDelaySetting(setting: {
    userId: string;
    enabled: boolean;
    delayHours: number;
  }): Promise<void>;

  getFeedDelaySetting(userId: string): Promise<{
    enabled: boolean;
    delayHours: number;
  } | null>;

  getWeeklySummary(userId: string): Promise<{
    batchComplianceDays: number;
    feedDelayDays: number;
    blockedCount: number;
  }>;
}
