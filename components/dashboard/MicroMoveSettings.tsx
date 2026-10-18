"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type Interval = 20 | 30 | 45;

const INTERVALS: Interval[] = [20, 30, 45];

const STORAGE_KEY = "micro-move-setting";

/**
 * AC-MOVE-01：マイクロムーブリマインドの設定
 * 【前提】ユーザーが設定画面を表示している
 * 【もし】「マイクロムーブリマインド」をオンに設定し、間隔を選択した（20分 / 30分 / 45分）
 * 【ならば】設定が保存され、選択した間隔でリマインドが通知される
 */
export function MicroMoveSettings() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [interval, setInterval] = useState<Interval>(30);
  const [enabled, setEnabled] = useState(true);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as { intervalMinutes: Interval; enabled: boolean };
      if (INTERVALS.includes(parsed.intervalMinutes)) {
        setInterval(parsed.intervalMinutes);
        setEnabled(parsed.enabled);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const saveSetting = () => {
    const setting = { intervalMinutes: interval, enabled };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(setting));
    setSavedMessage(t("microMove.saved"));
  };

  return (
    <section className="micro-move-card" aria-labelledby="micro-move-settings-title">
      <header className="micro-move-header">
        <p className="eyebrow">{t("microMove.eyebrow")}</p>
        <h2 id="micro-move-settings-title">{t("microMove.title")}</h2>
        <p className="micro-move-description">{t("microMove.description")}</p>
      </header>

      <button
        type="button"
        className="menu-button"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((current) => !current);
          setSavedMessage("");
        }}
      >
        {t("microMove.button")}
        <span aria-hidden="true">{isOpen ? "−" : "+"}</span>
      </button>

      {isOpen && (
        <div className="settings-panel">
          <fieldset>
            <legend>{t("microMove.intervalLabel")}</legend>
            <div className="interval-grid">
              {INTERVALS.map((value) => (
                <button
                  key={value}
                  type="button"
                  className={interval === value ? "interval-button selected" : "interval-button"}
                  aria-pressed={interval === value}
                  onClick={() => setInterval(value)}
                >
                  {t(`microMove.interval${value}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="toggle-row">
            <span>
              <strong>{t("microMove.enableLabel")}</strong>
              <small>{t("microMove.enableHint")}</small>
            </span>
            <input
              type="checkbox"
              checked={enabled}
              onChange={(event) => setEnabled(event.target.checked)}
            />
          </label>

          <button type="button" className="save-button" onClick={saveSetting}>
            {t("microMove.save")}
          </button>

          {savedMessage && (
            <div className="success-message" role="status">
              <strong>{savedMessage}</strong>
              <span>{t("microMove.notifyInterval", { interval })}</span>
            </div>
          )}
        </div>
      )}
    </section>
  );
}