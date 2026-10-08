---
name: "Quality Dashboard"
description: "Coverage, quality trends, delivery metrics, and failure monitoring for the DAMA project."
---

# 動的品質ダッシュボード

## 1. 収集対象

| 指標 | 収集元 | 目標 |
| --- | --- | --- |
| 型安全性 |  | 0 件の型エラー |
| 静的解析 |  | 警告・エラー 0 件 |
| テスト |  | 全件成功 |
| カバレッジ |  | 変更対象の分岐を検証 |
| テストピラミッド | テスト戦略・テスト実行結果 | テスト層ごとの規模と構成を把握 |
| 要求実装完了率 | 要求IDと実装・テストの追跡情報 | 対象要求の実装状況を把握 |
| DORA 4 Keys | CI / delivery log | 変化速度と安定性の把握 |
| 負債 | issue / backlog | 重要な技術負債の可視化 |

## 2. 必須の可視化

- **テストピラミッド**: 単体、統合、受け入れ、E2E の各層について、テスト件数と全体に占める割合を示す。テスト戦略で定義された配置・分類に従い、分類できないテストは推測で振り分けず、未分類として示す。
- **カバレッジの推移**: 行・関数・分岐カバレッジを時系列で示し、各測定値に取得日時とコミットを対応づける。履歴がない期間の値は補完・推測しない。
- **要求の実装完了率**: 対象要求の総数、実装完了数、未完了数、および完了率を示す。各要求は要求IDで追跡し、実装と検証の根拠が確認できる場合にのみ完了として数える。根拠がない要求や状態不明の要求は未完了として扱う。
- **要求実装完了率の推移**: 同じ要求集合と完了判定基準に基づく各時点の完了率を時系列で示し、測定日時とコミットを対応づける。対象要求や判定基準が変わった場合は、その変更を明示し、比較可能な推移として誤認させない。
- 完了根拠は `docs/quality/requirements-status.json` に要求IDごとに記録する。`implementation_paths` と `test_paths` はリポジトリ相対パスで指定し、実装ファイルが存在し、対応するテストファイルに成功したテストケースがある場合のみ完了とする。
- テストピラミッドはVitestのJSONレポートに含まれるテストケースを対象に、テストファイルの `tests/unit/`、`tests/integration/`、`tests/acceptance/`、`tests/e2e/` 配置で分類する。それ以外は未分類とし、実行レポートに含まれない層を実行済みとは扱わない。

## 3. 運用ルール

- CI は lint → type → test → coverage の順で実行する。
- 失敗したテスト、型エラー、重大な依存問題は即座に指摘対象とする。
- 変更前後の指標差分を比較し、品質低下の理由を特定する。
- 重要なリスクは時系列で追跡し、人手によるレビューが遅れる前に警告する。

## 4. 早期警戒

- 重要なテストの失敗率が上昇したら追加調査を行う。
- 変更量とテスト時間が増えた場合、品質データを再評価する。
- 実行時間や回帰の増加は、設計境界や依存を見直す契機とする。

## 5. GitHub Pagesへの公開

Push時の要求日本語化と品質ダッシュボードは、GitHub ActionsのPagesデプロイで公開する。

```bash
npm run requirements:humanize
npx vitest run --coverage --coverage.thresholds.lines=0 --coverage.thresholds.functions=0 --coverage.thresholds.branches=0 --reporter=json --outputFile=coverage/vitest-results.json
npm run dashboard:generate
```

- 要求ページ: `docs/pages/requirements/user-stories.ja.md`
- ダッシュボード: `docs/pages/quality-dashboard/index.html`
- GitHub Pagesのトップページ: `/`
- GitHub Pagesの公開URL: `/requirements/user-stories.ja.md` と `/quality-dashboard/`
- 元の要求YAMLと品質閾値は変更しない。
- 要求ページとダッシュボードは同じGitHub Pages Artifactへ配置する。
- テストピラミッド、カバレッジ推移、要求実装完了率とその推移を公開ダッシュボードに表示する。
- 推移を表示するための履歴は `quality-history` ブランチに保存し、Pages の再デプロイ後も参照可能にする。初回など履歴が1件しかない場合は、比較推移がまだないことを明示する。
- 要求集合が変わった場合、異なる要求集合の完了率を同じ推移として比較しない。
- テスト失敗時は公開ページを生成するが、品質状態を失敗として表示する。
- カバレッジ閾値が未達の場合は、Pages配信を中断せず、ダッシュボードに現状値を表示する。
- Pages用成果物は `docs/pages` を直接アップロードし、`destination` を指定しない。

## 6. 目標

- 品質の低下を早期に見える化し、継続的に改善する。
- 要件・設計・実装・テストの追跡性を指標と結びつける。
- 変化速度と安定性のバランスを保ち、リリース判定に活かす。
