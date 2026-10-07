# ADR-002: バックエンド・データベースとして Supabase を採用

**ステータス**: Accepted  
**作成日**: 2026-10-07  
**決定者**: プロジェクト推進者  
**関連要求**: BR-01（技術スタック方針）, NFR-SEC-01（ユーザーデータ保護）, NFR-AVAIL-01（可用性）

---

## 1. コンテキスト

MVP において以下が必要である。

- **ユーザー認証**: メール/SNSログイン
- **健康データの永続化**: 食事ログ・活動記録・通知設定等
- **リアルタイム更新**: タイマー状態など将来のリアルタイム同期ニーズ
- **セキュリティ**: ユーザーが自分のデータのみ参照・更新できること（NFR-SEC-01）
- **運用コストの最小化**: MVP フェーズでサーバー管理の工数をかけたくない

---

## 2. 決定

**Supabase** を認証・データベース・リアルタイム通信のすべてに採用する。

| 機能 | 採用方法 |
|---|---|
| 認証 | Supabase Auth（JWT、メール/OAuth） |
| データ永続化 | PostgreSQL（Supabase マネージド） |
| セキュリティ | Row Level Security（RLS）ポリシーを全テーブルに設定 |
| リアルタイム | Supabase Realtime（将来のタイマー同期等に利用） |
| クライアント接続 | `@supabase/supabase-js` SDK（Next.js フロント・APIルートの両方から使用） |

---

## 3. 理由

| 理由 | 詳細 |
|---|---|
| **PostgreSQL 採用** | スキーマが明確で、将来的な自前ホスト移行・他DBへの移行が容易 |
| **Row Level Security** | アプリ側のロジックに依存せずDB層でユーザーデータの分離を保証（NFR-SEC-01 を満たす） |
| **サーバーレス運用** | MVP 段階でインフラ管理の工数を最小化できる |
| **将来拡張性** | Flutter SDK（`supabase_flutter`）が存在し、Flutter 移行時も同一 BaaS を継続利用できる |

---

## 4. トレードオフ

| メリット | デメリット |
|---|---|
| 開発速度が高い（Auth・DB・Realtime がすぐ使える） | Supabase プロバイダーへのベンダー依存が発生する |
| RLS でデータ保護が容易 | 複雑なクエリは Supabase の制約を受ける場合がある |
| Flutter 移行後も再利用可能 | 無料プランの制限（接続数・ストレージ等）に将来ぶつかりうる |

---

## 5. RLS 設計方針

全テーブルに以下の基本ポリシーを適用する。

```sql
-- 例：eating_sessions テーブル
ALTER TABLE eating_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ユーザー本人のみ参照可能"
  ON eating_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "ユーザー本人のみ挿入可能"
  ON eating_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## 6. 却下した選択肢

- **Firebase（Firestore）**: NoSQL であり、スキーマが緩く後期の複雑なクエリに制約が出る。Flutter 移行後も使用可能だが PostgreSQL の方が型安全なスキーマ管理が可能。
- **自前 Node.js + PostgreSQL**: 認証・DB・インフラすべて自前で管理するコストが MVP 段階で大きすぎる。

---

## 7. 関連 ADR

- [ADR-001: Clean Architecture 採用](ADR-001-clean-architecture.md)
- [ADR-004: ディレクトリ構成](ADR-004-directory-structure.md)

