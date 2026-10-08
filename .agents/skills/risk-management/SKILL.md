---
name: "Risk Management Guide"
description: "Guardrails for dependency safety, green-to-green validation, change scope, and rollback criteria in the DAMA project."
---

# リスク管理ガイド

## 1. 実装境界

- `src/domain` は外部依存を持たない。
- `src/usecases` はドメインとアダプタの境界を制御する。
- `src/infrastructure` と `src/routes` の詳細がドメインへ漏れないようにする。
- 依存パッケージの更新は、型チェック・Lint・テストの結果を確認してから導入する。

## 2. ガードレール

- 1 ターン最大 3 ファイルを基本とする。
- Green-to-Green を維持する。
- ルールの変更とテスト追加を同じ単位で扱う。
- 認証情報やシークレットをリポジトリへ含めない。
- 重大な依存リスクや DB 設計の変更はレビュー前に影響範囲を明示する。

## 3. ロールバック基準

- テストや型チェックが失敗した場合は、最小修正で直前の Green 状態へ戻す。
- 影響範囲が大きい変更は、段階的に切り分けてリリース判定を行う。
- 外部サービス連携の変更は、実環境とテスト環境の差異を確認してから採用する。

## 4. 事前確認

- 変更前に対象要件や ADR を確認する。
- 実装変更に伴うリスクを短く記録し、レビュー観点と合わせる。
- 復旧手順と影響範囲をチームで共有する。
