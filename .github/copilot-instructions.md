# Copilot Instructions

## 前提条件

- **回答は必ず日本語でしてください。**

## 基本方針

- `copilot-instructions.md` には全体共通ルールおよび各スキルの役割インデックスのみを記載する。
- 詳細な専門ドメイン・設計知識は `.github/skills/*/SKILL.md` に分離し、状況に応じて該当スキルを参照して作業を行う。
- コミット時は `conventional-commits` スキルに従い、適切なプレフィックス（`feat`, `fix`, `docs`, `refactor` 等）を付与する。

## プロジェクト概要

**Project Dama（プロジェクトダマ）** は、進化的ミスマッチ（Evolutionary Mismatch）を解消するヘルスケア＆習慣化Webアプリ。4機能領域（食行動・光・身体活動・デジタルデトックス）をMVPとして提供する。

### 主要ドキュメント
- 要件定義: `docs/requirements/vision-scope.md`, `docs/requirements/user-stories.yaml`
- アーキテクチャ: `docs/architecture/c4-model.md`, `docs/architecture/adr/`

### 技術スタック概要
- **フロントエンド**: Next.js 14+（App Router, TypeScript strict, Tailwind CSS）
- **バックエンド / BaaS**: Supabase（認証 + PostgreSQL + Realtime）
- **アーキテクチャ**: Clean Architecture（`src/domain/` → `src/usecases/` → `src/adapters/` → `src/infrastructure/`）
- **静的解析・品質保証**: TypeScript strict, import-linter（依存方向の Fitness Function）
- **ドキュメント・要件管理**: MkDocs, Mermaid, Gherkin / BDD, 実例マッピング (Example Mapping)
- **メトリクス・可視化**: DORA 4 Keys, 動的品質ダッシュボード

### スキル役割インデックス

- `requirements-development`: 要求・受け入れ基準・日本語BDDの定義
- `test-strategy`: テスト層別・品質ゲート・不安定テスト防止
- `atdd-tdd`: ATDD（BDD）とTDDの赤→緑→リファクタリングによる開発サイクル
- `risk-management`: 変更範囲・ロールバック・依存安全性のガードレール

