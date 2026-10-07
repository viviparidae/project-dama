# ADR-004: プロジェクトディレクトリ構成

**ステータス**: Accepted  
**作成日**: 2026-10-07  
**決定者**: プロジェクト推進者  
**関連 ADR**: [ADR-001](ADR-001-clean-architecture.md), [ADR-003](ADR-003-nextjs-frontend.md)

---

## 1. コンテキスト

Clean Architecture（ADR-001）と Next.js App Router（ADR-003）を組み合わせた場合の、具体的なディレクトリ配置を決定する必要がある。Next.js の規約（`app/` ディレクトリ）と Clean Architecture の層構造（`src/domain/` 等）を両立させる配置方針を定める。

---

## 2. 決定

以下のディレクトリ構成を採用する。

```
/workspaces/-project-dama/
├── app/                          # Next.js App Router（UI層）
│   ├── (auth)/                   # 認証フロー（ログイン・サインアップ）
│   ├── dashboard/                # メインダッシュボード
│   ├── eating/                   # 食行動コントロール機能
│   ├── light/                    # 光・サーカディアンリズム機能
│   ├── activity/                 # 身体活動促進機能
│   ├── detox/                    # デジタルデトックス機能
│   ├── settings/                 # ユーザー設定
│   ├── api/                      # API Routes（routes層）
│   │   ├── eating/
│   │   ├── light/
│   │   ├── activity/
│   │   └── detox/
│   ├── layout.tsx
│   └── page.tsx
│
├── src/                          # Clean Architecture コア
│   ├── domain/                   # 純粋ドメイン層（外部依存禁止）
│   │   ├── eating/
│   │   │   ├── EatingSession.ts  # エンティティ
│   │   │   ├── SatietyTimer.ts   # 値オブジェクト
│   │   │   └── NOVAScore.ts      # 値オブジェクト
│   │   ├── light/
│   │   │   ├── CircadianRecord.ts
│   │   │   ├── SunlightLog.ts
│   │   │   └── DigitalSunset.ts
│   │   ├── activity/
│   │   │   ├── MicroMove.ts
│   │   │   ├── SedentaryBlock.ts
│   │   │   └── NEATScore.ts
│   │   └── detox/
│   │       ├── BatchNotification.ts
│   │       ├── FeedDelay.ts
│   │       └── DetoxLog.ts
│   │
│   ├── usecases/                 # アプリケーション層
│   │   ├── eating/
│   │   │   ├── StartEatingTimer.ts
│   │   │   ├── CheckFoodNOVA.ts
│   │   │   └── LogFoodEntry.ts
│   │   ├── light/
│   │   │   ├── RecordSunlight.ts
│   │   │   ├── TriggerDigitalSunset.ts
│   │   │   └── LogNightExposure.ts
│   │   ├── activity/
│   │   │   ├── ScheduleMicroMove.ts
│   │   │   ├── RecordMicroMove.ts
│   │   │   └── GetNEATSummary.ts
│   │   └── detox/
│   │       ├── ConfigureBatchNotify.ts
│   │       ├── DeliverBatchSummary.ts
│   │       └── SetFeedDelay.ts
│   │
│   ├── adapters/                 # インターフェース定義（抽象）
│   │   ├── IEatingRepository.ts
│   │   ├── ILightRepository.ts
│   │   ├── IActivityRepository.ts
│   │   ├── IDetoxRepository.ts
│   │   └── IFoodExternalService.ts
│   │
│   └── infrastructure/           # 外部依存の具体実装
│       ├── supabase/
│       │   ├── SupabaseEatingRepository.ts
│       │   ├── SupabaseLightRepository.ts
│       │   ├── SupabaseActivityRepository.ts
│       │   └── SupabaseDetoxRepository.ts
│       └── external/
│           ├── OpenFoodFactsService.ts   # NOVA食品データ
│           └── SunsetApiService.ts       # 日没時刻API
│
├── tests/                        # テストスイート
│   ├── unit/                     # ドメイン・ユースケース単体テスト
│   ├── integration/              # Supabase連携テスト
│   ├── e2e/                      # Playwright E2Eテスト
│   └── acceptance/               # BDD受け入れテスト（REQ ID対応）
│
├── docs/                         # ドキュメント
│   ├── requirements/             # 要件定義
│   │   ├── vision-scope.md
│   │   └── user-stories.yaml
│   └── architecture/             # アーキテクチャ設計
│       ├── c4-model.md
│       └── adr/
│           ├── ADR-001-clean-architecture.md
│           ├── ADR-002-supabase.md
│           ├── ADR-003-nextjs-frontend.md
│           └── ADR-004-directory-structure.md
│
├── .github/
│   ├── skills/                   # 設計・運用ガイドライン
│   └── workflows/                # CI/CD（GitHub Actions）
│
├── supabase/                     # Supabase マイグレーション・設定
│   ├── migrations/
│   └── seed.sql
│
├── public/
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

---

## 3. 重要な設計判断

### `src/` と `app/` の分離

| ディレクトリ | 役割 | Next.js 依存 |
|---|---|---|
| `app/` | UI・ルーティング・APIエンドポイント | **あり**（Next.js 専用） |
| `src/domain/` | エンティティ・ビジネスルール | **なし**（純粋 TypeScript） |
| `src/usecases/` | アプリケーションフロー | **なし**（純粋 TypeScript） |
| `src/adapters/` | インターフェース定義 | **なし**（純粋 TypeScript） |
| `src/infrastructure/` | Supabase・外部API実装 | **あり**（Supabase SDK） |

### 機能領域ごとのサブディレクトリ

4機能領域（eating / light / activity / detox）ごとにサブディレクトリを切ることで：
- 各領域を独立して変更・テストできる
- 将来の機能追加・削除が他領域に影響しない

---

## 4. 関連 ADR

- [ADR-001: Clean Architecture 採用](ADR-001-clean-architecture.md)
- [ADR-002: Supabase 採用](ADR-002-supabase.md)
- [ADR-003: Next.js フロントエンド採用](ADR-003-nextjs-frontend.md)

