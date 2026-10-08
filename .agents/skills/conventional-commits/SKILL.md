---
name: "Conventional Commits"
description: "Commit message conventions for readable, traceable, and review-friendly project history."
---

# Conventional Commits

## 目的

コミットメッセージは、変更内容と理由を機械的に読める形にして、履歴とレビューの品質を保つ。

## 基本ルール

- 形式は `type(scope): subject` とする。
- `type` は以下を基本とする。
  - `feat`: 新機能
  - `fix`: バグ修正
  - `docs`: ドキュメント更新
  - `refactor`: 振る舞いを変えない整理
  - `test`: テスト追加・修正
  - `chore`: 設定・雑務
  - `perf`: 性能改善
  - `style`: 書式調整
  - `ci`: CI 設定変更
- `scope` は必要に応じて `domain`, `usecase`, `api`, `db`, `docs` のように使用する。
- `subject` は簡潔で、命令形よりも結果中心にする。

## 例

- `feat(domain): add order validation rules`
- `fix(usecase): correct transaction rollback flow`
- `docs(requirements): update quality scenarios`
- `refactor(adapters): isolate http response mapping`
- `test(integration): cover repository boundary failures`
- `ci(quality): add coverage threshold gate`

## 禁止事項

- `wip`, `tmp`, `test123` のような曖昧なメッセージを使わない。
- 1 コミットに複数の責務を混ぜない。
- `fix` なのに機能追加を含めない。

## 実務上の運用

- コミットは 1 主目的 1 コミットを基本とする。
- 要件や設計が変わる場合は関連する ID を本文に含める。
- PR と issue の参照が必要な場合は本文に記載する。
