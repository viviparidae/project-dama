#!/usr/bin/env python3
"""Generate a GitHub Pages-ready quality dashboard from test and coverage reports."""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

TEST_LEVELS = (
    ("unit", "単体"),
    ("integration", "統合"),
    ("acceptance", "受け入れ"),
    ("e2e", "E2E"),
    ("unclassified", "未分類"),
)
HISTORY_VERSION = 1


def _percent(value: float | int) -> str:
    return f"{float(value):.1f}%"


def _read_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as stream:
        value = json.load(stream)
    if not isinstance(value, dict):
        raise ValueError(f"Expected a JSON object in {path}")
    return value


def _read_coverage(path: Path) -> dict[str, Any]:
    return _read_json(path)


def _coverage_percentages(coverage: dict[str, Any]) -> tuple[float, float, float]:
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

        for counts in file_report.get("b", {}).values():
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


def _test_path(test_result: dict[str, Any]) -> str:
    return str(test_result.get("name", "")).replace("\\", "/")


def _test_status(test_result: dict[str, Any]) -> str:
    assertions = test_result.get("assertionResults", [])
    if assertions:
        return (
            "passed"
            if all(assertion.get("status") == "passed" for assertion in assertions)
            else "failed"
        )
    return str(test_result.get("status", "unknown"))


def _test_count(test_result: dict[str, Any]) -> int:
    return len(test_result.get("assertionResults", []))


def _test_level(path: str) -> str:
    normalized = path.lower()
    for level, _ in TEST_LEVELS[:-1]:
        if f"/tests/{level}/" in f"/{normalized.lstrip('/')}" or normalized.startswith(
            f"tests/{level}/"
        ):
            return level
    return "unclassified"


def _test_pyramid(results: dict[str, Any]) -> dict[str, int]:
    counts = {level: 0 for level, _ in TEST_LEVELS}
    for test_result in results.get("testResults", []):
        level = _test_level(_test_path(test_result))
        counts[level] += _test_count(test_result)
    return counts


def _requirements(source: dict[str, Any]) -> list[str]:
    requirement_ids: list[str] = []
    for story in source.get("user_stories", []):
        requirement_ids.extend(
            criterion["ac_id"]
            for criterion in story.get("acceptance_criteria", [])
            if criterion.get("ac_id")
        )
    requirement_ids.extend(
        requirement["ac_id"]
        for requirement in source.get("non_functional_requirements", [])
        if requirement.get("ac_id")
    )
    if len(requirement_ids) != len(set(requirement_ids)):
        raise ValueError("Requirement IDs must be unique")
    return sorted(requirement_ids)


def _passing_test_paths(results: dict[str, Any]) -> set[str]:
    return {
        _test_path(test_result)
        for test_result in results.get("testResults", [])
        if test_result.get("assertionResults")
        and _test_status(test_result) == "passed"
    }


def _requirement_completion(
    requirement_ids: list[str],
    evidence: dict[str, Any],
    results: dict[str, Any],
    repository_root: Path,
) -> list[str]:
    evidence_by_id = evidence.get("requirements", {})
    unknown_ids = set(evidence_by_id) - set(requirement_ids)
    if unknown_ids:
        raise ValueError(f"Completion evidence references unknown requirement IDs: {sorted(unknown_ids)}")

    passing_tests = _passing_test_paths(results)
    completed: list[str] = []
    for requirement_id in requirement_ids:
        record = evidence_by_id.get(requirement_id, {})
        implementation_paths = record.get("implementation_paths", [])
        test_paths = record.get("test_paths", [])
        if not implementation_paths or not test_paths:
            continue

        paths = [*implementation_paths, *test_paths]
        if any(Path(path).is_absolute() or ".." in Path(path).parts for path in paths):
            raise ValueError(f"Evidence paths must be repository-relative: {requirement_id}")

        implementation_exists = all((repository_root / path).is_file() for path in implementation_paths)
        tests_passed = all(
            (repository_root / path).is_file()
            and any(test_path.endswith(path.replace("\\", "/")) for test_path in passing_tests)
            for path in test_paths
        )
        if implementation_exists and tests_passed:
            completed.append(requirement_id)
    return completed


def _commit_id(explicit_commit: str | None, repository_root: Path) -> str:
    if explicit_commit:
        return explicit_commit
    if os.environ.get("GITHUB_SHA"):
        return os.environ["GITHUB_SHA"]
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "HEAD"], cwd=repository_root, text=True, stderr=subprocess.DEVNULL
        ).strip()
    except (FileNotFoundError, subprocess.CalledProcessError):
        return "unknown"


def _snapshot(
    results: dict[str, Any],
    coverage: dict[str, Any],
    requirement_ids: list[str],
    completed_requirements: list[str],
    commit: str,
    generated_at: str,
) -> dict[str, Any]:
    lines, functions, branches = _coverage_percentages(coverage)
    scope_fingerprint = hashlib.sha256(
        json.dumps(requirement_ids, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    ).hexdigest()
    return {
        "generated_at": generated_at,
        "commit": commit,
        "coverage": {"lines": lines, "functions": functions, "branches": branches},
        "requirements": {
            "scope_fingerprint": scope_fingerprint,
            "total": len(requirement_ids),
            "completed": completed_requirements,
        },
    }


def _update_history(history_path: Path | None, snapshot: dict[str, Any]) -> list[dict[str, Any]]:
    if history_path is None or not history_path.exists():
        history: dict[str, Any] = {"version": HISTORY_VERSION, "snapshots": []}
    else:
        history = _read_json(history_path)
        if history.get("version") != HISTORY_VERSION or not isinstance(
            history.get("snapshots"), list
        ):
            raise ValueError(f"Unsupported quality history format: {history_path}")

    snapshots = [point for point in history["snapshots"] if point.get("commit") != snapshot["commit"]]
    snapshots.append(snapshot)
    if history_path is not None:
        history_path.parent.mkdir(parents=True, exist_ok=True)
        history_path.write_text(
            json.dumps(
                {"version": HISTORY_VERSION, "snapshots": snapshots},
                ensure_ascii=False,
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
    return snapshots


def _render_trend(
    snapshots: list[dict[str, Any]], metric: str, label: str, scope_fingerprint: str | None = None
) -> str:
    points = [
        snapshot
        for snapshot in snapshots
        if scope_fingerprint is None
        or snapshot.get("requirements", {}).get("scope_fingerprint") == scope_fingerprint
    ]
    values = [
        (
            float(snapshot["coverage"][metric])
            if scope_fingerprint is None
            else len(snapshot["requirements"]["completed"])
            / snapshot["requirements"]["total"]
            * 100
            if snapshot["requirements"]["total"]
            else 100.0
        )
        for snapshot in points
    ]
    if not points:
        return f'<p class="note">{html.escape(label)}の比較可能な履歴はありません。</p>'
    if len(points) == 1:
        return (
            f'<p class="note">{html.escape(label)}の履歴は1件です。'
            "推移の比較は次回以降の計測で表示されます。</p>"
        )

    width, height, padding = 720, 220, 36
    min_value, max_value = min(values), max(values)
    span = max(max_value - min_value, 1.0)
    coords = [
        (
            padding + index * (width - padding * 2) / (len(values) - 1),
            height - padding - (value - min_value) / span * (height - padding * 2),
        )
        for index, value in enumerate(values)
    ]
    polyline = " ".join(f"{x:.1f},{y:.1f}" for x, y in coords)
    circles = "".join(
        f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4"><title>{html.escape(points[index]["generated_at"])} '
        f'{html.escape(points[index]["commit"][:7])}: {_percent(values[index])}</title></circle>'
        for index, (x, y) in enumerate(coords)
    )
    return f"""<figure class="trend">
  <svg viewBox="0 0 {width} {height}" role="img" aria-label="{html.escape(label)}の推移">
    <polyline points="{polyline}"></polyline>{circles}
  </svg>
  <figcaption>{html.escape(points[0]["generated_at"])} ～ {html.escape(points[-1]["generated_at"])}
    （{len(points)}件。各点に日時・コミットを表示）</figcaption>
</figure>"""


def render_dashboard(
    results: dict[str, Any],
    coverage: dict[str, Any],
    *,
    requirements_source: dict[str, Any] | None = None,
    requirements_evidence: dict[str, Any] | None = None,
    repository_root: Path | None = None,
    history_path: Path | None = None,
    commit: str | None = None,
    generated_at: str | None = None,
) -> str:
    test_files = results.get("numTotalTestSuites", 0)
    tests = results.get("numTotalTests", 0)
    passed = results.get("numPassedTests", 0)
    failed = results.get("numFailedTests", 0)
    success_rate = 100 if tests == 0 else (passed / tests) * 100
    line_coverage, function_coverage, branch_coverage = _coverage_percentages(coverage)
    root = repository_root or Path.cwd()
    requirement_ids = _requirements(requirements_source or {})
    completed_requirements = _requirement_completion(
        requirement_ids, requirements_evidence or {}, results, root
    )
    timestamp = generated_at or datetime.now(timezone.utc).isoformat(timespec="seconds")
    snapshot = _snapshot(
        results,
        coverage,
        requirement_ids,
        completed_requirements,
        _commit_id(commit, root),
        timestamp,
    )
    history = _update_history(history_path, snapshot)
    scope_fingerprint = snapshot["requirements"]["scope_fingerprint"]

    pyramid = _test_pyramid(results)
    reported_tests = sum(pyramid.values())
    pyramid_rows = "".join(
        f'<tr><th scope="row">{html.escape(label)}</th><td>{pyramid[level]}</td>'
        f'<td>{_percent(pyramid[level] / reported_tests * 100 if reported_tests else 0)}</td>'
        f'<td><span class="bar"><span style="width:{pyramid[level] / reported_tests * 100 if reported_tests else 0:.1f}%"></span></span></td></tr>'
        for level, label in TEST_LEVELS
    )
    coverage_rows = "".join(
        f"<tr><th scope=\"row\">{label}</th><td>{_percent(value)}</td></tr>"
        for label, value in (
            ("行カバレッジ", line_coverage),
            ("関数カバレッジ", function_coverage),
            ("分岐カバレッジ", branch_coverage),
        )
    )
    requirement_total = len(requirement_ids)
    requirement_completed = len(completed_requirements)
    requirement_incomplete = requirement_total - requirement_completed
    requirement_rate = (
        requirement_completed / requirement_total * 100 if requirement_total else None
    )
    requirement_rows = "".join(
        f"<tr><td>{html.escape(requirement_id)}</td><td>"
        f'{"完了（実装あり・テスト成功）" if requirement_id in completed_requirements else "未完了（証跡不足またはテスト未成功）"}'
        "</td></tr>"
        for requirement_id in requirement_ids
    )
    generated_status = "成功" if failed == 0 and results.get("success", True) else "失敗"
    requirement_history_fingerprints = {
        point.get("requirements", {}).get("scope_fingerprint") for point in history
    }
    scope_changed = len(requirement_history_fingerprints) > 1
    scope_notice = (
        '<p class="note">要求集合が変化した期間は比較から除外しています。</p>' if scope_changed else ""
    )
    requirement_rate_display = _percent(requirement_rate) if requirement_rate is not None else "—"
    requirement_trend = (
        _render_trend(history, "", "要求実装完了率", scope_fingerprint)
        if requirement_total
        else '<p class="note">要求定義が入力されていないため、完了率を算出できません。</p>'
    )
    return f"""<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Project Dama Quality Dashboard</title>
  <style>
    :root {{ color-scheme: light; font-family: system-ui, sans-serif; }}
    body {{ margin: 0; background: #f5f7fb; color: #172033; }}
    main {{ max-width: 1040px; margin: 0 auto; padding: 32px 20px; }}
    h1 {{ margin-top: 0; }}
    .cards {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; }}
    .card {{ background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 16px #0001; }}
    .value {{ font-size: 2rem; font-weight: 700; }}
    table {{ width: 100%; border-collapse: collapse; background: white; }}
    th, td {{ padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }}
    .status {{ color: {"#166534" if failed == 0 else "#b91c1c"}; font-weight: 700; }}
    .note, figcaption {{ color: #52606d; }}
    .bar {{ display: block; min-width: 120px; height: 12px; background: #e5e7eb; border-radius: 6px; }}
    .bar span {{ display: block; height: 100%; background: #2563eb; border-radius: inherit; }}
    .trend {{ margin: 0; padding: 16px; background: white; border-radius: 12px; }}
    .trend svg {{ width: 100%; max-height: 240px; overflow: visible; }}
    .trend polyline {{ fill: none; stroke: #2563eb; stroke-width: 3; }}
    .trend circle {{ fill: #1d4ed8; }}
    .scroll {{ overflow-x: auto; }}
  </style>
</head>
<body>
  <main>
    <h1>Project Dama Quality Dashboard</h1>
    <p class="status">状態: {generated_status}</p>
    <p class="note">生成時刻: {html.escape(timestamp)} ・コミット: {html.escape(snapshot["commit"][:12])}</p>
    <section class="cards">
      <article class="card"><strong>テストファイル</strong><div class="value">{test_files}</div></article>
      <article class="card"><strong>テスト件数</strong><div class="value">{tests}</div></article>
      <article class="card"><strong>成功率</strong><div class="value">{_percent(success_rate)}</div></article>
      <article class="card"><strong>失敗件数</strong><div class="value">{failed}</div></article>
    </section>
    <h2>テストピラミッド</h2>
    <p class="note">現在のVitest実行レポートに含まれる個別テスト {reported_tests} 件の内訳です。レポートに含まれない層は実行件数に数えず 0 件で表示します。</p>
    <div class="scroll"><table>
      <thead><tr><th>テスト層</th><th>件数</th><th>割合</th><th>構成</th></tr></thead>
      <tbody>{pyramid_rows}</tbody>
    </table></div>
    <h2>現在のカバレッジ</h2>
    <table><thead><tr><th>指標</th><th>値</th></tr></thead><tbody>{coverage_rows}</tbody></table>
    <h2>カバレッジの推移</h2>
    <h3>行カバレッジ</h3>{_render_trend(history, "lines", "行カバレッジ")}
    <h3>関数カバレッジ</h3>{_render_trend(history, "functions", "関数カバレッジ")}
    <h3>分岐カバレッジ</h3>{_render_trend(history, "branches", "分岐カバレッジ")}
    <h2>要求の実装完了率</h2>
    <section class="cards">
      <article class="card"><strong>対象要求</strong><div class="value">{requirement_total}</div></article>
      <article class="card"><strong>完了</strong><div class="value">{requirement_completed}</div></article>
      <article class="card"><strong>未完了</strong><div class="value">{requirement_incomplete}</div></article>
      <article class="card"><strong>完了率</strong><div class="value">{requirement_rate_display}</div></article>
    </section>
    <p class="note">要求IDごとに、実装ファイルの存在と対応テストの成功を確認できたものだけを完了として集計します。</p>
    <h3>要求ごとの状況</h3>
    <div class="scroll"><table>
      <thead><tr><th>要求ID</th><th>状態</th></tr></thead><tbody>{requirement_rows}</tbody>
    </table></div>
    <h2>要求実装完了率の推移</h2>
    {scope_notice}
    {requirement_trend}
  </main>
</body>
</html>
"""


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("results", type=Path)
    parser.add_argument("coverage", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--requirements", type=Path)
    parser.add_argument("--requirements-evidence", type=Path)
    parser.add_argument("--repository-root", type=Path, default=Path.cwd())
    parser.add_argument("--history", type=Path)
    parser.add_argument("--commit")
    args = parser.parse_args()

    requirements_source: dict[str, Any] = {}
    if args.requirements:
        import yaml

        with args.requirements.open("r", encoding="utf-8") as stream:
            loaded_requirements = yaml.safe_load(stream)
        if not isinstance(loaded_requirements, dict):
            raise ValueError("Requirements YAML root must be a mapping")
        requirements_source = loaded_requirements

    requirements_evidence = (
        _read_json(args.requirements_evidence) if args.requirements_evidence else {}
    )
    rendered = render_dashboard(
        _read_json(args.results),
        _read_coverage(args.coverage),
        requirements_source=requirements_source,
        requirements_evidence=requirements_evidence,
        repository_root=args.repository_root,
        history_path=args.history,
        commit=args.commit,
    )
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(rendered, encoding="utf-8")
    print(f"Generated {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
