import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  BatchNotification,
  TooManyBatchWindowsError,
} from "../../../src/domain/detox/BatchNotification";
import { FeedDelay } from "../../../src/domain/detox/FeedDelay";
import { ConfigureBatchNotify } from "../../../src/usecases/detox/ConfigureBatchNotify";
import { DeliverBatchSummary } from "../../../src/usecases/detox/DeliverBatchSummary";
import { SetFeedDelay } from "../../../src/usecases/detox/SetFeedDelay";

// ---------------------------------------------------------------------------
// AC-DETOX-01: バッチ通知設定
// ---------------------------------------------------------------------------
describe("AC-DETOX-01: バッチ通知設定を構成する", () => {
  it("有効な2ウィンドウで設定が保存される", async () => {
    const mockRepo = {
      saveBatchNotifySetting: vi.fn().mockResolvedValue(undefined),
      getBatchNotifySetting: vi.fn(),
      getPendingNotifications: vi.fn(),
      saveFeedDelaySetting: vi.fn(),
      getFeedDelaySetting: vi.fn(),
      getWeeklySummary: vi.fn(),
    };

    const useCase = new ConfigureBatchNotify(mockRepo);
    await useCase.execute({
      userId: "user-001",
      enabled: true,
      windows: [
        { hour: 8, minute: 0 },
        { hour: 18, minute: 0 },
      ],
    });

    expect(mockRepo.saveBatchNotifySetting).toHaveBeenCalledWith({
      userId: "user-001",
      enabled: true,
      windows: [
        { hour: 8, minute: 0 },
        { hour: 18, minute: 0 },
      ],
    });
  });

  it("4ウィンドウ指定時に TooManyBatchWindowsError がスローされる", async () => {
    const mockRepo = {
      saveBatchNotifySetting: vi.fn(),
      getBatchNotifySetting: vi.fn(),
      getPendingNotifications: vi.fn(),
      saveFeedDelaySetting: vi.fn(),
      getFeedDelaySetting: vi.fn(),
      getWeeklySummary: vi.fn(),
    };

    const useCase = new ConfigureBatchNotify(mockRepo);
    await expect(
      useCase.execute({
        userId: "user-001",
        enabled: true,
        windows: [
          { hour: 8, minute: 0 },
          { hour: 12, minute: 0 },
          { hour: 18, minute: 0 },
          { hour: 22, minute: 0 },
        ],
      })
    ).rejects.toThrow(TooManyBatchWindowsError);
  });
});

// ---------------------------------------------------------------------------
// AC-DETOX-02: 保留中の通知をまとめて配信する
// ---------------------------------------------------------------------------
describe("AC-DETOX-02: 保留中通知のバッチ配信", () => {
  it("2件の保留通知が返される", async () => {
    const pendingNotifications = [
      { id: "notif-1", content: "お知らせ1" },
      { id: "notif-2", content: "お知らせ2" },
    ];

    const mockRepo = {
      saveBatchNotifySetting: vi.fn(),
      getBatchNotifySetting: vi.fn(),
      getPendingNotifications: vi.fn().mockResolvedValue(pendingNotifications),
      saveFeedDelaySetting: vi.fn(),
      getFeedDelaySetting: vi.fn(),
      getWeeklySummary: vi.fn(),
    };

    const useCase = new DeliverBatchSummary(mockRepo);
    const result = await useCase.execute({ userId: "user-001" });

    expect(result.count).toBe(2);
    expect(result.notifications.length).toBe(2);
    expect(result.notifications).toEqual(pendingNotifications);
  });
});

// ---------------------------------------------------------------------------
// AC-DETOX-03: バッチウィンドウ内か判定する
// ---------------------------------------------------------------------------
describe("AC-DETOX-03: バッチ通知ウィンドウの時間内判定", () => {
  it("ウィンドウ外の時刻（15:00 JST）は false を返す", () => {
    const notification = new BatchNotification({
      enabled: true,
      windows: [{ hour: 8, minute: 0 }],
    });
    // 2026-10-07T15:00:00+09:00 → UTC 06:00 → getHours() in local env
    // Use a date whose local hours resolve to 15 (UTC+9 context)
    const now = new Date("2026-10-07T15:00:00+09:00");
    expect(notification.isInBatchWindow(now)).toBe(false);
  });

  it("ウィンドウ内の時刻（08:02 JST）は true を返す", () => {
    const notification = new BatchNotification({
      enabled: true,
      windows: [{ hour: 8, minute: 0 }],
    });
    const now = new Date("2026-10-07T08:02:00+09:00");
    expect(notification.isInBatchWindow(now)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// AC-DETOX-04: フィード遅延を設定する
// ---------------------------------------------------------------------------
describe("AC-DETOX-04: フィード遅延時間を設定する", () => {
  it.each([1, 3, 6, 24] as const)(
    "delayHours=%i で設定が保存される",
    async (delayHours) => {
      const mockRepo = {
        saveBatchNotifySetting: vi.fn(),
        getBatchNotifySetting: vi.fn(),
        getPendingNotifications: vi.fn(),
        saveFeedDelaySetting: vi.fn().mockResolvedValue(undefined),
        getFeedDelaySetting: vi.fn(),
        getWeeklySummary: vi.fn(),
      };

      const useCase = new SetFeedDelay(mockRepo);
      await useCase.execute({
        userId: "user-001",
        enabled: true,
        delayHours,
      });

      expect(mockRepo.saveFeedDelaySetting).toHaveBeenCalledWith({
        userId: "user-001",
        enabled: true,
        delayHours,
      });
    }
  );
});

// ---------------------------------------------------------------------------
// AC-DETOX-05: フィード遅延ステータスを取得する
// ---------------------------------------------------------------------------
describe("AC-DETOX-05: フィード遅延ステータスの確認", () => {
  it("enabled:true のとき delayActive が true になる", () => {
    const feedDelay = new FeedDelay({ enabled: true, delayHours: 3 });
    expect(feedDelay.getStatus()).toEqual({ delayActive: true, delayHours: 3 });
  });

  it("enabled:false のとき delayActive が false になる", () => {
    const feedDelay = new FeedDelay({ enabled: false, delayHours: 3 });
    expect(feedDelay.getStatus()).toEqual({
      delayActive: false,
      delayHours: 3,
    });
  });
});

// ---------------------------------------------------------------------------
// AC-DETOX-06: 週次サマリーを取得する
// ---------------------------------------------------------------------------
describe("AC-DETOX-06: デジタルデトックス週次サマリー", () => {
  it("週次サマリーが正しく返される", async () => {
    const summary = {
      batchComplianceDays: 5,
      feedDelayDays: 6,
      blockedCount: 42,
    };

    const mockRepo = {
      saveBatchNotifySetting: vi.fn(),
      getBatchNotifySetting: vi.fn(),
      getPendingNotifications: vi.fn(),
      saveFeedDelaySetting: vi.fn(),
      getFeedDelaySetting: vi.fn(),
      getWeeklySummary: vi.fn().mockResolvedValue(summary),
    };

    const useCase = new DeliverBatchSummary(mockRepo);
    const result = await useCase.getWeeklySummary({ userId: "user-001" });

    expect(result).toEqual({
      batchComplianceDays: 5,
      feedDelayDays: 6,
      blockedCount: 42,
    });
  });
});
