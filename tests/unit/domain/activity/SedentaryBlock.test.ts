import { describe, expect, it } from "vitest";
import { SedentaryBlock } from "../../../../src/domain/activity/SedentaryBlock";

describe("SedentaryBlock", () => {
  it("設定した間隔ちょうど到達した場合にリマインドが必要になる", () => {
    const block = new SedentaryBlock({
      startedAt: new Date("2026-10-07T10:00:00+09:00"),
      intervalMinutes: 30,
    });

    expect(block.shouldRemind(new Date("2026-10-07T10:30:00+09:00"))).toBe(true);
  });

  it("設定した間隔未満の場合にリマインドは必要にならない", () => {
    const block = new SedentaryBlock({
      startedAt: new Date("2026-10-07T10:00:00+09:00"),
      intervalMinutes: 30,
    });

    expect(block.shouldRemind(new Date("2026-10-07T10:29:59+09:00"))).toBe(false);
  });

  it("経過時間を分単位で取得する", () => {
    const block = new SedentaryBlock({
      startedAt: new Date("2026-10-07T10:00:00+09:00"),
      intervalMinutes: 30,
    });

    expect(block.getElapsedMinutes(new Date("2026-10-07T10:15:00+09:00"))).toBe(15);
  });
});
