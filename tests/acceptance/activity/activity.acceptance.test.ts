/**
 * 受け入れテスト：身体活動促進
 * US-MOVE-01 30分ごとのマイクロムーブリマインド
 * US-MOVE-02 NEATトラッキングによる活動量の可視化
 */

import { describe, it, expect, vi } from "vitest";
import { IActivityRepository } from "../../../src/adapters/IActivityRepository";
import { NEATScore } from "../../../src/domain/activity/NEATScore";
import { SedentaryBlock } from "../../../src/domain/activity/SedentaryBlock";
import { GetActivitySummary } from "../../../src/usecases/activity/GetActivitySummary";
import { GetWeeklyNEATScores } from "../../../src/usecases/activity/GetWeeklyNEATScores";
import { RecordMicroMove } from "../../../src/usecases/activity/RecordMicroMove";
import { ScheduleMicroMove } from "../../../src/usecases/activity/ScheduleMicroMove";

// -----------------------------------------------------------------------
// AC-MOVE-01：マイクロムーブリマインドの設定
// -----------------------------------------------------------------------
describe("AC-MOVE-01：マイクロムーブリマインドの設定", () => {
  /**
   * 【前提】ユーザーが設定画面を表示している
   * 【もし】マイクロムーブリマインドをオンにし、間隔を選択した（20分 / 30分 / 45分）
   * 【ならば】設定が保存され、選択した間隔でリマインドが通知されるようになる
   */
  it.each([20, 30, 45])(
    "間隔%d分を選択すると設定がintervalMinutes=%d分で保存される",
    async (intervalMinutes) => {
      const saveMicroMoveSetting = vi.fn().mockResolvedValue(undefined);
      const mockActivityRepo: IActivityRepository = {
        saveMicroMoveSetting,
        getMicroMoveSetting: vi.fn(),
        recordMicroMove: vi.fn(),
        getDailySummary: vi.fn(),
        getWeeklyNEATScores: vi.fn(),
      };
      const useCase = new ScheduleMicroMove(mockActivityRepo);

      await useCase.execute({ userId: "user-1", intervalMinutes });

      expect(saveMicroMoveSetting).toHaveBeenCalledWith({
        userId: "user-1",
        intervalMinutes,
        enabled: true,
      });
    }
  );
});

// -----------------------------------------------------------------------
// AC-MOVE-02：静止ブロック検出後のリマインド通知（ドメインロジック）
// -----------------------------------------------------------------------
describe("AC-MOVE-02：静止ブロック検出後のリマインド通知", () => {
  /**
   * 【前提】マイクロムーブリマインドが有効になっている
   * 【前提】設定した間隔（デフォルト：30分）継続してアプリを操作中または静止状態
   * 【もし】設定間隔が経過した
   * 【ならば】軽運動を促す通知が表示される
   */
  it("30分間静止が継続した場合にリマインドが必要と判定される", () => {
    const block = new SedentaryBlock({
      startedAt: new Date("2026-10-07T10:00:00+09:00"),
      intervalMinutes: 30,
    });

    expect(block.shouldRemind(new Date("2026-10-07T10:30:00+09:00"))).toBe(true);
  });

  it("設定間隔未満の静止では通知不要と判定される", () => {
    const block = new SedentaryBlock({
      startedAt: new Date("2026-10-07T10:00:00+09:00"),
      intervalMinutes: 30,
    });

    expect(block.shouldRemind(new Date("2026-10-07T10:29:59+09:00"))).toBe(false);
  });
});

// -----------------------------------------------------------------------
// AC-MOVE-03：マイクロムーブの完了記録
// -----------------------------------------------------------------------
describe("AC-MOVE-03：マイクロムーブの完了記録", () => {
  /**
   * 【前提】マイクロムーブのリマインド通知が表示されている
   * 【もし】「完了」ボタンを押した
   * 【ならば】本日のマイクロムーブ実施回数が1増加し、静止タイマーがリセットされる
   */
  it("完了を記録すると実施回数が1増加し静止タイマーがリセットされる", async () => {
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
    expect(result.todayCount).toBe(1);
    expect(result.sedentaryTimerReset).toBe(true);
  });
});

// -----------------------------------------------------------------------
// AC-MOVE-04：本日の静止継続時間の可視化
// -----------------------------------------------------------------------
describe("AC-MOVE-04：本日の静止継続時間の可視化", () => {
  /**
   * 【前提】ユーザーがアクティビティ画面を表示している
   * 【もし】本日のサマリーを確認した
   * 【ならば】合計静止時間（連続30分超えのブロック数）とマイクロムーブ完了回数がグラフで表示される
   */
  it("本日のサマリーにsedentaryBlocksとmicroMoveCountが含まれる", async () => {
    const repository: IActivityRepository = {
      saveMicroMoveSetting: vi.fn(),
      getMicroMoveSetting: vi.fn(),
      recordMicroMove: vi.fn(),
      getDailySummary: vi.fn().mockResolvedValue({
        sedentaryBlocks: 3,
        microMoveCount: 5,
        totalSedentaryMinutes: 95,
      }),
      getWeeklyNEATScores: vi.fn(),
    };
    const useCase = new GetActivitySummary(repository);

    const result = await useCase.execute({
      userId: "user-1",
      date: "2026-10-07",
    });

    expect(repository.getDailySummary).toHaveBeenCalledWith("user-1", "2026-10-07");
    expect(result).toEqual({
      sedentaryBlocks: 3,
      microMoveCount: 5,
      totalSedentaryMinutes: 95,
    });
  });
});

// -----------------------------------------------------------------------
// AC-MOVE-05：日次NEATスコアの表示（ドメインロジック）
// -----------------------------------------------------------------------
describe("AC-MOVE-05：日次NEATスコアの表示", () => {
  /**
   * 【前提】ユーザーがアクティビティ画面を表示している
   * 【もし】本日のサマリーを確認した
   * 【ならば】マイクロムーブ完了回数・歩数・静止ブロック数を統合したNEATスコアが表示される
   */
  it("microMoveCount=5 steps=8000 sedentaryBlocks=2 のときNEATスコアが算出される", () => {
    const score = NEATScore.calculate({
      microMoveCount: 5,
      steps: 8000,
      sedentaryBlocks: 2,
    });

    expect(score.getValue()).toBeGreaterThan(0);
    expect(typeof score.getValue()).toBe("number");
  });

  it("静止ブロックが増えるとNEATスコアが減少する", () => {
    const baseScore = NEATScore.calculate({
      microMoveCount: 5,
      steps: 8000,
      sedentaryBlocks: 0,
    });
    const worseScore = NEATScore.calculate({
      microMoveCount: 5,
      steps: 8000,
      sedentaryBlocks: 5,
    });

    expect(worseScore.getValue()).toBeLessThan(baseScore.getValue());
  });
});

// -----------------------------------------------------------------------
// AC-MOVE-06：週間NEATトレンドの確認
// -----------------------------------------------------------------------
describe("AC-MOVE-06：週間NEATトレンドの確認", () => {
  /**
   * 【前提】ユーザーがアクティビティ画面の週間ビューを表示している
   * 【もし】週間グラフを確認した
   * 【ならば】過去7日間の日次NEATスコア推移が折れ線グラフで表示される
   */
  it("過去7日間のNEATスコアが7要素の配列として返される", async () => {
    const repository: IActivityRepository = {
      saveMicroMoveSetting: vi.fn(),
      getMicroMoveSetting: vi.fn(),
      recordMicroMove: vi.fn(),
      getDailySummary: vi.fn(),
      getWeeklyNEATScores: vi.fn().mockResolvedValue(
        Array.from({ length: 7 }, (_, i) => ({
          date: `2026-10-0${i + 1}`,
          score: 60 + i * 5,
        }))
      ),
    };
    const useCase = new GetWeeklyNEATScores(repository);

    const result = await useCase.execute({ userId: "user-1" });

    expect(repository.getWeeklyNEATScores).toHaveBeenCalledWith("user-1");
    expect(result).toHaveLength(7);
    expect(result.map((entry) => entry.score)).toEqual(
      Array.from({ length: 7 }, (_, i) => 60 + i * 5)
    );
  });
});

