// @vitest-environment jsdom
/**
 * コンポーネントテスト：マイクロムーブ設定
 * AC-MOVE-01：マイクロムーブリマインドの設定
 * 【前提】ユーザーが設定画面を表示している
 * 【もし】「マイクロムーブリマインド」をオンに設定し、間隔を選択した（20分 / 30分 / 45分）
 * 【ならば】設定が保存され、選択した間隔でリマインドが通知される
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { MicroMoveSettings } from "../../../components/dashboard/MicroMoveSettings";

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

let container: HTMLDivElement;
let root: Root;

function clickButton(label: string) {
  const buttons = Array.from(container.querySelectorAll("button"));
  const target = buttons.find((button) => button.textContent?.includes(label));
  if (!target) throw new Error(`ボタンが見つかりません: ${label}`);
  act(() => {
    target.click();
  });
}

beforeEach(() => {
  window.localStorage.clear();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  act(() => {
    root.render(<MicroMoveSettings />);
  });
});

afterEach(() => {
  act(() => {
    root.unmount();
  });
  container.remove();
  window.localStorage.clear();
});

describe("AC-MOVE-01：マイクロムーブリマインドの設定", () => {
  it("「マイクロムーブリマインド」ボタンが表示される", () => {
    expect(container.textContent).toContain("マイクロムーブリマインド");
  });

  it("ボタンをクリックすると間隔選択（20分/30分/45分）と保存ボタンが表示される", () => {
    clickButton("マイクロムーブリマインド");
    expect(container.textContent).toContain("20分");
    expect(container.textContent).toContain("30分");
    expect(container.textContent).toContain("45分");
    expect(container.textContent).toContain("保存");
  });

  it("30分を選択して保存すると設定が保存された旨と通知間隔が表示される", () => {
    clickButton("マイクロムーブリマインド");
    clickButton("30分");
    clickButton("保存");
    expect(container.textContent).toContain("設定を保存しました");
    expect(container.textContent).toContain("30分間隔で通知します");
  });

  it("保存した設定がlocalStorageに30分で書き込まれる", () => {
    clickButton("マイクロムーブリマインド");
    clickButton("30分");
    clickButton("保存");
    const saved = window.localStorage.getItem("micro-move-setting");
    expect(saved).not.toBeNull();
    const parsed = JSON.parse(saved as string) as {
      intervalMinutes: number;
      enabled: boolean;
    };
    expect(parsed.intervalMinutes).toBe(30);
    expect(parsed.enabled).toBe(true);
  });
});