# ADR-003: フロントエンドとして Next.js（App Router）を採用

**ステータス**: Accepted  
**作成日**: 2026-10-07  
**決定者**: プロジェクト推進者  
**関連要求**: BR-01（技術スタック方針）, NFR-PERF-01（レスポンスタイム）, NFR-USAB-01（操作ステップ数）

---

## 1. コンテキスト

MVP のフロントエンドとして、以下の条件を満たすフレームワークが必要である。

- **Webファースト**: ブラウザで動作し、モバイルブラウザにも対応
- **パフォーマンス**: 初期ロードの高速化（NFR-PERF-01）
- **開発生産性**: MVPを迅速に構築できる
- **将来移行**: ドメイン層・ユースケース層を再利用してFlutterへ移行しやすい設計
- **API層の統合**: バックエンドAPIを別サーバーを建てずに同一リポジトリで管理したい

---

## 2. 決定

**Next.js 14+（App Router）** を採用する。

| 採用方針 | 詳細 |
|---|---|
| **レンダリング** | App Router + React Server Components (RSC) を基本とし、インタラクティブな部分のみ Client Components |
| **APIルート** | `app/api/` 配下に API Routes を配置し、ドメイン・ユースケース層を呼び出す |
| **スタイリング** | Tailwind CSS（ユーティリティファーストで高速開発） |
| **状態管理** | サーバーステートは RSC / Server Actions、クライアントステートは Zustand（最小限） |
| **型安全性** | TypeScript 厳格モード（`strict: true`） |

---

## 3. 理由

| 理由 | 詳細 |
|---|---|
| **SSR/SSG 対応** | 初期ロードが速く、SEO・パフォーマンスに優れる（NFR-PERF-01） |
| **フルスタック統合** | API Routes により別途バックエンドサーバーが不要（MVP 運用コスト削減） |
| **TypeScript 親和性** | ドメイン層を純粋 TypeScript で書き、Next.js と型を共有できる |
| **将来の Flutter 移行** | ドメイン層・ユースケース層は Next.js 非依存で記述するため移行時に再利用可能 |
| **エコシステム** | Vercel デプロイ、Supabase 連携が容易 |

---

## 4. トレードオフ

| メリット | デメリット |
|---|---|
| SSR で初期表示が速い | App Router の学習コスト（RSC vs CC の使い分け） |
| API Routes でサーバー統合 | Vercel への依存（セルフホストは別途設定が必要） |
| TypeScript でドメイン共有 | Flutter 移行時に Dart への書き直しは発生する（ただしロジックは文書化済み） |

---

## 5. Flutter 移行戦略

Flutter 移行時のドメイン再利用方針：

1. `src/domain/` の TypeScript モデルは **Dart クラスへの変換ガイド** として機能する
2. `src/usecases/` のユースケースロジックは Dart の同名クラスに移植する
3. `src/infrastructure/` の Supabase 実装は `supabase_flutter` SDK に差し替える
4. Next.js API Routes は不要になり、Flutter が Supabase へ直接アクセスする

---

## 6. 却下した選択肢

- **React Native**: Web と同一コードベース管理が難しく、Web MVP には過剰。
- **Vite + React（SPA）**: SSR がなく、初期ロードが遅い。API サーバーを別途立てる必要がある。
- **Remix**: 良い選択肢だが Vercel + Supabase の組み合わせでは Next.js の方がドキュメント・サンプルが豊富。

---

## 7. 関連 ADR

- [ADR-001: Clean Architecture 採用](ADR-001-clean-architecture.md)
- [ADR-004: ディレクトリ構成](ADR-004-directory-structure.md)

