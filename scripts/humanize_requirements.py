#!/usr/bin/env python3
"""Generate a Japanese, readable version of the project requirements YAML."""

from __future__ import annotations

import argparse
import html
import re
from pathlib import Path
from typing import Any

import yaml


def _escape(value: Any) -> str:
    return html.escape(str(value), quote=True)


def _render_acceptance_criteria(criteria: list[dict[str, Any]]) -> list[str]:
    lines: list[str] = []
    for criterion in criteria:
        lines.extend(
            [
                f"### {criterion.get('title', '受け入れ基準')}",
                f"- 優先度: {criterion.get('priority', '')}",
                "",
            ]
        )
        for label, key in (("【前提】", "given"), ("【もし】", "when"), ("【ならば】", "then")):
            values = criterion.get(key, [])
            if values:
                lines.append(f"- {label}")
                lines.extend(f"  - {value}" for value in values)
        lines.append("")
    return lines


def render_markdown(source: dict[str, Any]) -> str:
    lines = [
        "# プロジェクトダマ 要求一覧",
        "",
        f"- バージョン: {_escape(source.get('version', ''))}",
        f"- プロジェクト: {_escape(source.get('project', ''))}",
        f"- ステータス: {_escape(source.get('status', ''))}",
        "",
    ]

    for story in source.get("user_stories", []):
        lines.extend(
            [
                f"## {story.get('id', '')}: {_escape(story.get('title', ''))}",
                f"- 主体: {_escape(story.get('actor', ''))}",
                f"- 目的: {_escape(story.get('goal', ''))}",
                f"- 理由: {_escape(story.get('reason', ''))}",
                "",
            ]
        )
        lines.extend(_render_acceptance_criteria(story.get("acceptance_criteria", [])))

    return "\n".join(lines).rstrip() + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()

    with args.source.open("r", encoding="utf-8") as stream:
        source = yaml.safe_load(stream)
    if not isinstance(source, dict):
        raise ValueError("要求YAMLのルートはマッピングである必要があります")

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(render_markdown(source), encoding="utf-8")
    print(f"Generated {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
