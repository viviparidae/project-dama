---
name: "Testing Strategy Guide"
description: "Test-level strategy covering unit, component, integration, acceptances, E2E, and flaky-test prevention for Python projects."
---

# テスト戦略

## 1. 目的

- 要件 ID ごとに受け入れテストと実装テストを連携させる。
- 実装詳細ではなく観測可能な振る舞いを検証する。
- Flaky を防ぎ、フィードバックが高速なテスト構成を維持する。

## 2. テストレベル

| レベル | 対象 | 主な検証内容 |
| --- | --- | --- |
| Solo Unit | ドメインロジック | 条件分岐、値計算、境界条件 |
| Social Unit | ドメインオブジェクト連携 | 状態遷移とルール適用 |
| In-process Component | ユースケースと境界 | 依存を抑えた高速統合 |
| Out-of-process Component | DB / API / 外部連携 | 実際の接続と契約の検証 |
| Persistence Integration | Repository / DB | クエリと永続化の妥当性 |
| Gateway Integration | 外部サービス | 通信エラーとデータ変換 |
| E2E | エンドツーエンド導線 | ユーザー操作の完結性 |
| Acceptance | 要件適合 | Given-When-Then の観点で検証 |

## 3. テストピラミッド

- 基底: 単体テストとインプロセスコンポーネントテスト
- 中間: 統合と受け入れテスト
- 頂点: E2E は必要最小限にとどめる

## 4. 重要ルール

- テスト名はドメイン語で記述し、実装詳細を露出しない。
- `sleep` を固定待機に使わない。
- 乱数や時間に依存するテストは固定化する。
- 外部依存はスタブまたはテスト用境界に閉じ込める。
- 受け入れテストは `REQ-xxx` と対応させる。

## 5. 不安定テスト防止

- 並列実行時にデータ競合が起きないよう、テストデータを分離する。
- DB リセットはテストごとに明示的に行う。
- UI や API の非同期待ちには、状態ベースの待機を優先する。

## 6. 品質ゲート

- PR 作成時に関連する全テストが通ることを確認する。
- 要件の追加や変更時は対応する受け入れテストを同時に更新する。
- 失敗しているテストは原因を記録し、見逃さない。
