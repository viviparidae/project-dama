import { describe, expect, it, vi } from "vitest";
import { IActivityRepository } from "../../../../src/adapters/IActivityRepository";
import { ScheduleMicroMove } from "../../../../src/usecases/activity/ScheduleMicroMove";

describe("ScheduleMicroMove", () => {
  it.each([20, 30, 45])(
    "%d分の設定を有効状態で保存する",
    async (intervalMinutes) => {
      const saveMicroMoveSetting = vi.fn().mockResolvedValue(undefined);
      const repository: IActivityRepository = {
        saveMicroMoveSetting,
        getMicroMoveSetting: vi.fn(),
        recordMicroMove: vi.fn(),
        getDailySummary: vi.fn(),
        getWeeklyNEATScores: vi.fn(),
      };
      const useCase = new ScheduleMicroMove(repository);

      await useCase.execute({ userId: "user-1", intervalMinutes });

      expect(saveMicroMoveSetting).toHaveBeenCalledWith({
        userId: "user-1",
        intervalMinutes,
        enabled: true,
      });
    }
  );

  it.each([10, 60, 90])(
    "%d分の間隔は保存せず、エラーを返す",
    async (intervalMinutes) => {
      const saveMicroMoveSetting = vi.fn().mockResolvedValue(undefined);
      const repository: IActivityRepository = {
        saveMicroMoveSetting,
        getMicroMoveSetting: vi.fn(),
        recordMicroMove: vi.fn(),
        getDailySummary: vi.fn(),
        getWeeklyNEATScores: vi.fn(),
      };
      const useCase = new ScheduleMicroMove(repository);

      await expect(
        useCase.execute({ userId: "user-1", intervalMinutes })
      ).rejects.toThrow("20分、30分、45分のいずれかです");
      expect(saveMicroMoveSetting).not.toHaveBeenCalled();
    }
  );
});
