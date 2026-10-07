import { describe, expect, it, vi } from "vitest";
import { IActivityRepository } from "../../../../src/adapters/IActivityRepository";
import { RecordMicroMove } from "../../../../src/usecases/activity/RecordMicroMove";

describe("RecordMicroMove", () => {
  it("完了したマイクロムーブを記録し、当日の実施回数を返す", async () => {
    const recordMicroMove = vi.fn().mockResolvedValue({ todayCount: 1 });
    const repository: IActivityRepository = {
      saveMicroMoveSetting: vi.fn(),
      getMicroMoveSetting: vi.fn(),
      recordMicroMove,
      getDailySummary: vi.fn(),
      getWeeklyNEATScores: vi.fn(),
    };
    const useCase = new RecordMicroMove(repository);

    const result = await useCase.execute({ userId: "user-1" });

    expect(recordMicroMove).toHaveBeenCalledWith({
      userId: "user-1",
      completedAt: expect.any(Date),
    });
    expect(result).toEqual({ todayCount: 1, sedentaryTimerReset: true });
  });
});
