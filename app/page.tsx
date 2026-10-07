"use client";

import { useEffect, useState } from "react";

type Interval = 20 | 30 | 45;

const INTERVALS: Interval[] = [20, 30, 45];

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [interval, setInterval] = useState<Interval>(30);
  const [enabled, setEnabled] = useState(true);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem("micro-move-setting");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as { intervalMinutes: Interval; enabled: boolean };
      if (INTERVALS.includes(parsed.intervalMinutes)) {
        setInterval(parsed.intervalMinutes);
        setEnabled(parsed.enabled);
      }
    } catch {
      window.localStorage.removeItem("micro-move-setting");
    }
  }, []);

  const saveSetting = () => {
    const setting = { intervalMinutes: interval, enabled };
    window.localStorage.setItem("micro-move-setting", JSON.stringify(setting));
    setSavedMessage("設定を保存しました");
  };

  return (
    <main className="page-shell">
      <section className="settings-card" aria-labelledby="settings-title">
        <header className="settings-header">
          <p className="eyebrow">身体活動</p>
          <h1 id="settings-title">マイクロムーブ設定</h1>
          <p>設定した間隔で軽運動を促す通知を受け取ります。</p>
        </header>

        <button
          className="menu-button"
          type="button"
          aria-expanded={isOpen}
          onClick={() => {
            setIsOpen((current) => !current);
            setSavedMessage("");
          }}
        >
          マイクロムーブリマインド
          <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
        </button>

        {isOpen && (
          <div className="settings-panel">
            <fieldset>
              <legend>通知間隔</legend>
              <div className="interval-grid">
                {INTERVALS.map((value) => (
                  <button
                    key={value}
                    className={interval === value ? "interval-button selected" : "interval-button"}
                    type="button"
                    aria-pressed={interval === value}
                    onClick={() => setInterval(value)}
                  >
                    {value}分
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="toggle-row">
              <span>
                <strong>通知を有効にする</strong>
                <small>設定した間隔で通知を表示します。</small>
              </span>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(event) => setEnabled(event.target.checked)}
              />
            </label>

            <button className="save-button" type="button" onClick={saveSetting}>
              保存
            </button>

            {savedMessage && (
              <div className="success-message" role="status">
                <strong>{savedMessage}</strong>
                <span>{interval}分間隔で通知します</span>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
