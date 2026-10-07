import { beforeEach, describe, expect, it } from "vitest";
import { IActivityRepository } from "../../../src/adapters/IActivityRepository";
import { ScheduleMicroMove } from "../../../src/usecases/activity/ScheduleMicroMove";

class InMemoryActivityRepository implements IActivityRepository {
  private settings: Array<{ userId: string; intervalMinutes: number; enabled: boolean }> = [];

  async saveMicroMoveSetting(setting: {
    userId: string;
    intervalMinutes: number;
    enabled: boolean;
  }): Promise<void> {
    this.settings = this.settings.filter((current) => current.userId !== setting.userId);
    this.settings.push(setting);
  }

  async getMicroMoveSetting(userId: string): Promise<{
    intervalMinutes: number;
    enabled: boolean;
  } | null> {
    const setting = this.settings.find((current) => current.userId === userId);
    return setting
      ? {
          intervalMinutes: setting.intervalMinutes,
          enabled: setting.enabled,
        }
      : null;
  }

  async recordMicroMove(): Promise<{ todayCount: number }> {
    return { todayCount: 0 };
  }

  async getDailySummary(): Promise<{
    sedentaryBlocks: number;
    microMoveCount: number;
    totalSedentaryMinutes: number;
  }> {
    return { sedentaryBlocks: 0, microMoveCount: 0, totalSedentaryMinutes: 0 };
  }

  async getWeeklyNEATScores(): Promise<Array<{ date: string; score: number }>> {
    return [];
  }
}

describe("ScheduleMicroMove integration", () => {
  let repository: InMemoryActivityRepository;
  let useCase: ScheduleMicroMove;

  beforeEach(() => {
    repository = new InMemoryActivityRepository();
    useCase = new ScheduleMicroMove(repository);
  });

  it("設定を保存し、同じユーザーの設定を再取得できる", async () => {
    await useCase.execute({ userId: "user-1", intervalMinutes: 30 });

    await expect(repository.getMicroMoveSetting("user-1")).resolves.toEqual({
      intervalMinutes: 30,
      enabled: true,
    });
  });

  it("同じユーザーで設定を再保存し、最終設定を反映する", async () => {
    await useCase.execute({ userId: "user-1", intervalMinutes: 20 });
    await useCase.execute({ userId: "user-1", intervalMinutes: 45 });

    await expect(repository.getMicroMoveSetting("user-1")).resolves.toEqual({
      intervalMinutes: 45,
      enabled: true,
    });
  });
});
