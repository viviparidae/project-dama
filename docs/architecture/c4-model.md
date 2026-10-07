# C4 モデル — アーキテクチャ概要図
**ドキュメントID**: ARCH-C4-01  
**バージョン**: 1.0.0  
**作成日**: 2026-10-07  
**関連ADR**: [ADR-001](adr/ADR-001-clean-architecture.md), [ADR-002](adr/ADR-002-supabase.md), [ADR-003](adr/ADR-003-nextjs-frontend.md)

---

## Level 1：システムコンテキスト図（System Context Diagram）

システム全体とその外部要素との関係を示す。

```mermaid
graph TD
    User["👤 ユーザー<br/>(10〜30代 バイオハッカー層)<br/>Webブラウザ経由でアクセス"]

    subgraph Dama["🟦 Project Dama システム"]
        WebApp["Dama Web App<br/>(Next.js)"]
    end

    subgraph External["外部システム"]
        Supabase["☁️ Supabase<br/>(認証 / PostgreSQL / Realtime)"]
        SunsetAPI["🌅 日没時刻 API<br/>(sunrise-sunset.org 等)"]
        NOVA["🍎 食品データベース<br/>(Open Food Facts / NOVA分類)"]
    end

    User -->|"HTTPS / ブラウザ"| WebApp
    WebApp -->|"REST / Realtime"| Supabase
    WebApp -->|"HTTPS"| SunsetAPI
    WebApp -->|"HTTPS"| NOVA
```

---

## Level 2：コンテナ図（Container Diagram）

Damaシステム内部のコンテナ（デプロイ可能単位）とその関係を示す。

```mermaid
graph TD
    User["👤 ユーザー<br/>(Webブラウザ)"]

    subgraph DamaSystem["Project Dama システム境界"]

        subgraph Frontend["フロントエンド コンテナ"]
            NextApp["Next.js App<br/>---<br/>・App Router (RSC)<br/>・Tailwind CSS<br/>・Supabase Client SDK<br/>・PWA対応 (将来)"]
        end

        subgraph AppLayer["アプリケーション層（Next.js API Routes）"]
            APIRoutes["API Routes<br/>---<br/>・/api/timer/*<br/>・/api/food/*<br/>・/api/light/*<br/>・/api/activity/*<br/>・/api/detox/*"]
        end

        subgraph DomainLayer["ドメイン層（Pure TypeScript）"]
            Domain["Domain Models<br/>---<br/>・EatingSession<br/>・CircadianRecord<br/>・MicroMove<br/>・BatchNotification<br/>・FeedDelay"]
            UseCases["Use Cases<br/>---<br/>・StartEatingTimer<br/>・CheckFoodNOVA<br/>・RecordSunlight<br/>・ScheduleMicroMove<br/>・BatchNotifications"]
        end

        subgraph InfraLayer["インフラ層"]
            SupabaseAdapter["Supabase Adapter<br/>---<br/>・認証 (JWT)<br/>・CRUD (REST)<br/>・Realtime購読"]
            ExternalAdapter["External API Adapter<br/>---<br/>・日没時刻取得<br/>・NOVA食品データ取得"]
        end

    end

    subgraph ExternalSystems["外部システム"]
        Supabase["☁️ Supabase<br/>(Auth + PostgreSQL + Realtime)"]
        SunsetAPI["🌅 日没時刻 API"]
        NOVADB["🍎 Open Food Facts"]
    end

    User -->|"HTTPS"| NextApp
    NextApp -->|"Server Actions / fetch"| APIRoutes
    NextApp -->|"Supabase Client (Realtime)"| Supabase
    APIRoutes --> UseCases
    UseCases --> Domain
    UseCases --> SupabaseAdapter
    UseCases --> ExternalAdapter
    SupabaseAdapter -->|"REST / Realtime"| Supabase
    ExternalAdapter -->|"HTTPS"| SunsetAPI
    ExternalAdapter -->|"HTTPS"| NOVADB
```

---

## Level 3：コンポーネント図（Component Diagram）— ドメイン層詳細

ドメイン層の内部構造と各ユースケースの依存関係を示す。

```mermaid
graph LR
    subgraph Domain["src/domain/"]
        EatDomain["eating/<br/>EatingSession<br/>SatietyTimer<br/>NOVAScore"]
        LightDomain["light/<br/>CircadianRecord<br/>SunlightLog<br/>DigitalSunset"]
        MoveDomain["activity/<br/>MicroMove<br/>SedentaryBlock<br/>NEATScore"]
        DetoxDomain["detox/<br/>BatchNotification<br/>FeedDelay<br/>DetoxLog"]
    end

    subgraph UseCases["src/usecases/"]
        EatUC["eating/<br/>StartEatingTimer<br/>CheckFoodNOVA<br/>LogFoodEntry"]
        LightUC["light/<br/>RecordSunlight<br/>TriggerDigitalSunset<br/>LogNightExposure"]
        MoveUC["activity/<br/>ScheduleMicroMove<br/>RecordMicroMove<br/>GetNEATSummary"]
        DetoxUC["detox/<br/>ConfigureBatchNotify<br/>DeliverBatchSummary<br/>SetFeedDelay"]
    end

    subgraph Adapters["src/adapters/ (interfaces)"]
        ITimerRepo["ITimerRepository"]
        IFoodRepo["IFoodRepository"]
        ILightRepo["ILightRepository"]
        IActivityRepo["IActivityRepository"]
        IDetoxRepo["IDetoxRepository"]
    end

    EatUC --> EatDomain
    LightUC --> LightDomain
    MoveUC --> MoveDomain
    DetoxUC --> DetoxDomain

    EatUC --> ITimerRepo
    EatUC --> IFoodRepo
    LightUC --> ILightRepo
    MoveUC --> IActivityRepo
    DetoxUC --> IDetoxRepo
```

---

## 依存方向ルール（要約）

```
routes/pages → usecases → domain        ✅ OK
adapters → usecases → domain             ✅ OK
infrastructure → adapters                ✅ OK
domain → usecases                        ❌ NG（依存の逆転）
domain → infrastructure                  ❌ NG（外部依存）
usecases → infrastructure（直接）        ❌ NG（抽象化を挟む）
```

---

## 関連ドキュメント

- [ビジョン・スコープ定義書](../requirements/vision-scope.md)
- [ユーザーストーリー・受け入れ基準](../requirements/user-stories.yaml)
- [ADR-001: Clean Architecture 採用](adr/ADR-001-clean-architecture.md)
- [ADR-002: Supabase 採用](adr/ADR-002-supabase.md)
- [ADR-003: Next.js フロントエンド採用](adr/ADR-003-nextjs-frontend.md)
- [ADR-004: ディレクトリ構成](adr/ADR-004-directory-structure.md)

