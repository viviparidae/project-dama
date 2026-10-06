---
name: "CI Strategy"
description: "Quality gates for static analysis, test execution, coverage checks, and delivery workflow in the DAMA project."
---

# CI / デリバリー戦略

## 1. 品質ゲート

PR 和 merge 前に以下を必須とする。

```bash
mypy --strict
ruff check .
pytest
coverage run -m pytest
```

- `mypy --strict`: 型安全性の破壊を阻止する。
- `ruff check .`: 低コストで静的解析を実行する。
- `pytest`: テストスイートの全件成功を確認する。
- `coverage`: 変更領域のカバレッジを確認し、品質劣化を検知する。

## 2. 検証階層

1. コミットステージ: Lint, 型チェック, Unit/Component test を高速に実行する。
2. 統合ステージ: DB, API, インフラ境界を含む統合テストを実行する。
3. リリース判定: 品質ゲート失敗時はマージをブロックする。

## 3. DORA 4 Keys

- Deployment Frequency: 変更のデプロイ頻度を記録する
- Lead Time for Changes: 改修からデプロイまでの時間を計測する
- Change Failure Rate: 失敗率と再発率を追跡する
- Time to Restore Service: 障害復旧時間を計測する

## 4. キャッシュと実行効率

- 依存関係のキャッシュを利用して初期化時間を短縮する。
- 単体・統合・E2E を段階的に分離し、フィードバック速度を最適化する。
- 実行コストの高いテストは専用ステージで処理する。

## 5. 失敗時の扱い

- テスト失敗、型エラー、Lint 違反があればプルリクエストを停止する。
- 依存更新やインフラ変更時は、ログと結果を残し、再現条件を記録する。
- 失敗の理由が外部環境に由来する場合は、再試行条件と回避策を明確にする。
