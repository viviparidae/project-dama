#!/usr/bin/env python3
"""Generate a GitHub Pages-ready quality dashboard from Vitest JSON output."""

from __future__ import annotations

import argparse
import html
import json
from datetime import datetime, timezone
from pathlib import Path


def _percent(value: float | int) -> str:
    return f"{float(value):.1f}%"


def _read_coverage(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as stream:
        return json.load(stream)


def _coverage_percentages(coverage: dict) -> tuple[float, float, float]:
    statement_total = 0
    statement_covered = 0
    function_total = 0
    function_covered = 0
    branch_total = 0
    branch_covered = 0

    for file_report in coverage.values():
        if not isinstance(file_report, dict):
            continue

        statement_counts = file_report.get("s", {})
        statement_total += len(statement_counts)
        statement_covered += sum(
            1 for count in statement_counts.values() if isinstance(count, (int, float)) and count > 0
        )

        function_counts = file_report.get("f", {})
        function_total += len(function_counts)
        function_covered += sum(
            1 for count in function_counts.values() if isinstance(count, (int, float)) and count > 0
        )

        branch_counts = file_report.get("b", {})
        for counts in branch_counts.values():
            if isinstance(counts, list):
                branch_total += len(counts)
                branch_covered += sum(
                    1 for count in counts if isinstance(count, (int, float)) and count > 0
                )

    def percentage(total: int, covered: int) -> float:
        return 100.0 if total == 0 else covered / total * 100

    return (
        percentage(statement_total, statement_covered),
        percentage(function_total, function_covered),
        percentage(branch_total, branch_covered),
    )


def render_dashboard(results: dict, coverage: dict) -> str:
    test_files = results.get("numTotalTestSuites", 0)
    tests = results.get("numTotalTests", 0)
    passed = results.get("numPassedTests", 0)
    failed = results.get("numFailedTests", 0)
    success_rate = 100 if tests == 0 else (passed / tests) * 100
    line_coverage, function_coverage, branch_coverage = _coverage_percentages(coverage)

    rows = "".join(
        f"<tr><td>{name}</td><td>{_percent(value)}</td></tr>"
        for name, value in (
            ("行カバレッジ", line_coverage),
            ("関数カバレッジ", function_coverage),
            ("分岐カバレッジ", branch_coverage),
        )
    )

    generated_at = datetime.now(timezone.utc).isoformat(timespec="seconds")
    status = "成功" if failed == 0 else "失敗"
    return f"""<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Project Dama Quality Dashboard</title>
  <style>
    :root {{ color-scheme: light; font-family: system-ui, sans-serif; }}
    body {{ margin: 0; background: #f5f7fb; color: #172033; }}
    main {{ max-width: 960px; margin: 0 auto; padding: 32px 20px; }}
    h1 {{ margin-top: 0; }}
    .cards {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }}
    .card {{ background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 16px #0001; }}
    .value {{ font-size: 2rem; font-weight: 700; }}
    table {{ width: 100%; border-collapse: collapse; background: white; }}
    th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }}
    .status {{ color: {"#166534" if failed == 0 else "#b91c1c"}; font-weight: 700; }}
    .note {{ color: #52606d; }}
  </style>
</head>
<body>
  <main>
    <h1>Project Dama Quality Dashboard</h1>
    <p class="status">状態: {status}</p>
    <p class="note">生成時刻: {html.escape(generated_at)}</p>
    <section class="cards">
      <article class="card"><strong>テストファイル</strong><div class="value">{test_files}</div></article>
      <article class="card"><strong>テスト件数</strong><div class="value">{tests}</div></article>
      <article class="card"><strong>成功率</strong><div class="value">{_percent(success_rate)}</div></article>
      <article class="card"><strong>失敗件数</strong><div class="value">{failed}</div></article>
    </section>
    <h2>カバレッジ</h2>
    <table>
      <thead><tr><th>指標</th><th>値</th></tr></thead>
      <tbody>{rows}</tbody>
    </table>
  </main>
</body>
</html>
"""


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("results", type=Path)
    parser.add_argument("coverage", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    results = json.loads(args.results.read_text(encoding="utf-8"))
    coverage = _read_coverage(args.coverage)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(render_dashboard(results, coverage), encoding="utf-8")
    print(f"Generated {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
