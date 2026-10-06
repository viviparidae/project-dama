---
name: "Clean Architecture for Python Services"
description: "Rules for dependency direction, domain purity, application workflows, adapters, and ADR-based design for the DAMA project."
---

# Clean Architecture 設計ガイド

## 1. 目的

本プロジェクトでは、ドメインロジックを外部依存から分離し、ビジネスルールを安定して保守可能にする。実装は依存関係の方向を固定し、境界を明確にする。

## 2. 基本構造

```text
src/
├── domain/           # 依存なしの純粋ドメインモデルとビジネスルール
├── usecases/         # アプリケーションユースケースと orchestrator
├── adapters/         # API/CLI/DB/外部サービスの変換層
├── routes/           # HTTP リクエスト・レスポンス境界
├── infrastructure/   # DB, ファイルI/O, サービス連携
└── ...
```

## 3. 依存方向

```text
routes -> usecases -> domain
adapters -> usecases -> domain
infrastructure -> adapters / usecases
```

- `domain/` は外部ライブラリ、DB、HTTP、ファイルI/O を直接参照しない。
- `usecases/` はドメインロジックを呼び出し、外部境界を抽象化する。
- `adapters/` と `routes/` は実装詳細と I/O の変換に限定する。
- `infrastructure/` は外部依存の実装を持つが、依存の中心は上位レイヤへ向ける。

## 4. 設計ルール

- ルール・エンティティ・値オブジェクトは `src/domain/` に配置する。
- ビジネスフローの制御とユースケースの呼び出しは `src/usecases/` に集約する。
- HTTP / CLI / DB の詳細実装は `src/adapters/` または `src/infrastructure/` に閉じ込める。
- 依存の逆転を行う場合は抽象化（Protocol / Interface）を使う。
- `import-linter` や fitness function で依存ルールを監視する。

## 5. 品質ゲート

- mypy --strict で型安全性を確認する。
- ruff / flake8 で静的解析を通す。
- `src/domain` と `src/usecases` の依存境界をレビュー対象にする。
- 重要な設計判断は ADR として記録する。

## 6. 要求追跡

- `REQ-xxx`: 機能要求と非機能要求
- `ADR-xxx`: 設計判断と一貫性の文書化
- `C4 Model`: システム境界とコンポーネント関係の説明

## 7. ADR の運用

- 変更の理由とトレードオフを ADR に明記する。
- 既存 ADR を破壊せず、必要に応じて `Superseded` として扱う。
- 設計の再検討時に ADR と実装・テストを同時に更新する。
