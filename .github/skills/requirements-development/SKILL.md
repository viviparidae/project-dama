---
name: "Requirements Development"
description: "Rules for requirement writing, example mapping, Given-When-Then scenarios, and quality characteristics based on software requirements best practices."
---

# 要求開発ガイドライン

## 1. 基本原則

要求を定義するときは、ユーザー価値と受け入れ条件を明確にし、実装詳細を混在させない。

- `REQ-xxx`: 機能要求または非機能要求の識別子
- `NFR-xxx`: 品質シナリオの識別子
- `Given-When-Then`: 行動と結果を明示する記述スタイル
- BRIEF 原則: 何を達成するかを簡潔に記述し、How まで踏み込まない

## 2. 要求書の品質特性

要求仕様書は以下を満たす必要がある。

1. 完全性: 必要な振る舞いと制約が揃っている
2. 一貫性: 同一テーマに矛盾がない
3. 修正可能性: 変更しやすく、追跡しやすい
4. 追跡可能性: 要件とテストの対応が明確である
5. 有効性: 実装者とレビューアが判断できる情報を持つ

## 3. 要求記述のルール

- 1 要求 1 主張に分離する。
- 実装詳細（DB テーブル、HTTP パス、クラス名など）は避ける。
- 観測可能な状態変化と操作結果を記載する。
- テストで判断可能な形にする。

## 4. 実例マッピング

要求の解釈差異を減らすために、以下を整理する。

- Story: ユーザー価値の最小単位
- Rule: ルールや制約
- Example: 具体例
- Question: 未確定事項

## 5. Given-When-Then 形式

```text
- 要求 ID: REQ-001 [Must]
- タイトル: 取引データの検証
- Given: 取引入力が妥当な状態である
- When: ユーザーがリクエストを送信する
- Then: システムは受理し、結果を返す
```

## 6. 品質シナリオ

非機能要求は下記を含めて定義する。

- Source: 刺激の発生主体
- Stimulus: 何を起こすか
- Environment: 実行環境
- Artifact: 対象コンポーネント
- Response: 期待される応答
- Response Measure: 測定尺度

## 7. 実務上の運用

- 要件を固める前に実例マッピングを行う。
- このプロジェクトでは `docs/requirements/` に要求追加し、`tests/` で受け入れテストへ落とし込む。
- 実装に着手する前に、要求とテストの対応が明確であることを確認する。
