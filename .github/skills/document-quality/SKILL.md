---
name: "Documentation Quality"
description: "Traceability and quality requirements for requirements, ADRs, implementation, and testing in the DAMA project."
---

# ドキュメント品質運用ガイド

## 1. トレーサビリティ

- 要求 ID は `REQ-xxx`、非機能要求は `NFR-xxx` とする。
- ADR は `ADR-xxx` で管理し、設計判断の背景と影響範囲を記録する。
- 実装、テスト、要求、ADR の間で双方向追跡を維持する。
- 変更時には、どの要求または ADR に対応しているかを記述する。

## 2. 必須レビュー観点

- 要求書と実装の整合が取れているか。
- 複数の要求が重複していないか。
- 既存 ADR と新設計が矛盾していないか。
- テストが要求 ID を参照しているか。
- Markdown のリンク切れや古い内容が残っていないか。

## 3. 文書更新ルール

- 要件定義を更新した場合は、対応する設計とテストを同じ PR で更新する。
- 実装変更時は、関連する ADR や要求追跡情報を補完する。
- 過去の設計判断を削除せず、必要に応じて `Superseded` として明示する。

## 4. 品質保持

- ISO/IEC 29148 に沿って要求の明確性・妥当性・検証可能性を維持する。
- 必要に応じて Mermaid を使って構造や依存関係を説明する。
- MkDocs または doc portal の導線を維持し、レビューしやすい構造にする。
