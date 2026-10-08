# 画面設計書：Evolutionary Mismatch Explorer

- 作成日: 2026-10-08
- ステータス: Draft
- 対象: Project Dama MVP
- 参照モックアップ: Evolutionary Mismatch Explorer

## 1. 目的

本画面は、ユーザーが現代社会における「進化的ミスマッチ」を視覚的に理解し、4つの生活領域に対する介入策（intervention）を選択することで、身体・認知・睡眠・行動の整合性を改善するための支援画面である。

本モックアップの目的は、単なる設定画面ではなく、「現在のミスマッチの状態」「改善の方向性」「生理学的な根拠」を一度に確認できるダッシュボードとして機能させることである。

---

## 2. 画面の役割と想定ユーザー

### 2.1 想定ユーザー
- 健康意識の高いユーザー
- 日々の生活習慣を最適化したいユーザー
- 食事、睡眠、運動、デジタルデトックスに改善意欲があるユーザー

### 2.2 画面の役割
- 現在のリスク状態を数値化して把握させる
- ドメイン別に改善方法を提示する
- ユーザーが小さな介入を選択しやすい導線を設ける
- 「なぜそれが効くのか」を生体メカニズムとして説明する

---

## 3. 画面全体の構成

本画面は大きく以下の構成で設計する。

1. ヘッダー
2. KPIカード（3件）
3. ドメインタブ
4. メインコンテンツ（左右2列）
   - 左: ドメイン情報と介入項目
   - 右: 生理機序と指標
5. フッターアクションバー

---

## 4. レイアウト設計

### 4.1 画面サイズ
- 最大幅: 980px
- 中央寄せ
- 画面上部余白: 28px
- 外周余白: 16px

### 4.2 グリッド構成
- 全体: 1列
- KPI: 3列グリッド
- 本体: 2列グリッド（1.2:1 相対比）
- 画面幅が 760px 未満で 1列に変換

### 4.3 視覚階層
- ヘッダーで文脈を提示
- KPIカードで「危険度」「幸福感」「対策活用度」をすぐ見えるようにする
- ドメインタブで対象領域を切り替え可能にする
- 右側のメカニズムと指標で、選択した介入の効果を説明する

---

## 5. 画面セクション別設計

### 5.1 ヘッダー

- タイトル: "Evolutionary Mismatch Explorer"
- サブタイトル: "Align modern digital and physical behavior with ancestral human biology."
- 役割: 画面の目的と価値提案を一瞬で伝える

設計意図:
- 説明的な文言ではなく、科学的・教育的なトーンを採用
- 画面全体を「生物学と行動修正の相談室」風に見せる

### 5.2 KPIカード

3つのカードを並べる。

#### 1) Mismatch Index
- 表示内容: 数値（例: 65/100）
- 進捗バー
- 増減表示（例: -20 pts）
- 役割: 現在のミスマッチの大きさを示す

#### 2) Well-Being Score
- 表示内容: 数値（例: 70/100）
- 進捗バー
- 増減表示（例: +35 pts）
- 役割: 心身の幸福感の総合指標

#### 3) Active Mitigations
- 表示内容: "0 / 12"
- 進捗バー
- 状態ラベル: High Risk / Moderate / Aligned
- 役割: ユーザーがどの程度介入を実行しているかを可視化

設計意図:
- 数字の背景を「危険」「改善中」「整合」という状態で読み解きやすくする
- 数値と視覚的なバーにより、直感的な理解を促す

### 5.3 ドメインタブ

タブ項目:
- Nutrition
- Movement
- Light & Sleep
- Attention & Social

- 役割: Focused domain switch
- 見た目: 角丸のPill-shapedボタン
- 状態: 選択中はアクセントカラー＋濃い背景

設計意図:
- 特定領域の改善策に集中させることで、ユーザーを迷わせない
- ドメインを切り替えるたびにメインコンテンツが更新される

### 5.4 左側パネル: ドメイン情報と介入

#### ヘッダー
- ドメインタイトル: "Nutrition & Metabolism"
- サブタイトル: "Aligning nutrient density and meal timing with digestive biology."

#### コンテキストボックス
- 「Ancestral Trait」
- 「Modern Trigger」
- 左縁にアクセントバーを設置し、説明の文脈を視認しやすくする

#### 「Targeted Interventions」
各項目は以下の構成を持つ。
- 介入名
- 効果スコア（例: +18 Well-being | -15 Mismatch）
- スイッチコントロール（ON/OFF）

設計意図:
- 「選ぶ」「見積もる」「変化する」を直感的に行える
- スイッチで直接生活習慣をシミュレーションできる

### 5.5 右側パネル: 生理機序と指標

#### Biological Mechanisms
- 選択中の介入が有効な場合に、各介入の生理学的説明を表示
- 表示形式: カード形式
- 例: "Restores hepatic clock gene expression & insular sensitivity during nocturnal phase."

#### Domain Indicators
- 各指標の状態を表示する
- 例:
  - Postprandial Glycemic Spikes
  - Endogenous GLP-1 Release
  - Hepatic Autophagy
- 状態表示は「base」または「active」

設計意図:
- 介入が「何のために有効か」を説明し、単なるチェックボックスではなく、知識の伝達を伴う
- 「改善前後」の差分を視覚的に示す

### 5.6 フッターアクションバー

- 左側: "X interventions active across 4 domains. Mismatch score is Y/100."
- 右側: "Reset All States"

役割:
- 現在の状態を要約する
- 一括リセットによる再体験を可能にする

---

## 6. インタラクション設計

### 6.1 ドメイン切替
- タブクリック時に `selectedDomain` が切り替わる
- ドメインに対応するインターベンション・指標・生理機序が再描画される

### 6.2 介入の選択
- いずれかの介入をタップすると ON/OFF が切り替わる
- 1つでも選択すると全体スコアが再計算される
- すべてのドメインをまたいでの累積効果を可視化する

### 6.3 状態反映
- Mismatch Index が減少する
- Well-Being Score が上昇する
- Active Mitigations の件数が増加する
- 影響があった状態に応じて表示ラベルが変化する

### 6.4 リセット
- リセットボタン押下時に全インターベンションの選択状態がクリアされ、初期状態へ戻る

---

## 7. デザインシステム（モックアップから抽出）

### 7.1 カラーパレット
- 背景: #f4f1ee
- サーフェス: #ffffff
- コンテナ: #f2f0f0
- 強調: #3186ff
- アクセント: #dcf1ff
- テキスト: #101820
- 変数説明: #de2d29
- 成功/良好: #008052
- warning/amber: #b7852e

### 7.2 余白設計
- コンポーネント間: 8〜12px
- セクション間: 14〜16px
- 通常カード: 12〜16px padding
- 大きなセクション: 18px 20px

### 7.3 タイポグラフィ
- 基本フォント: Google Sans Flex / Segoe UI / sans-serif
- ラベル: 12px〜14px
- 本文: 14px〜16px
- タイトル: 1.4〜2.2rem
- 数値: 1.35〜2.0rem

### 7.4 角丸
- 小: 10px
- 中: 12px〜16px
- 大: 18px
- Pill タブ: 999px

### 7.5 シャドウ
- ほぼ控えめの柔らかい影を使用し、情報の階層を作る
- 例: `0 16px 36px rgba(28, 47, 76, 0.1)`

---

## 8. 画面状態と状態遷移

### 8.1 初期状態
- Nutrition がアクティブ
- すべて未選択
- Mismatch Index は高い値を示す
- Well-Being Score は低め

### 8.2 改善状態
- 介入を選択するとスコアが改善される
- 生理機序カードが表示される
- 指標が active 状態へ切り替わる

### 8.3 リセット状態
- すべての選択を解除し、初期状態へ戻る

---

## 9. モバイル対応

### 9.1 画面サイズ別挙動
- 760px 未満: KPIを 1 列に変更
- 760px 未満: 本体を 1 列に変更
- 480px 未満: フッターを縦積みレイアウトに変更

### 9.2 重要な設計方針
- タブは横スクロール可能にし、操作性を維持
- 介入項目はタップ領域を十分に確保
- 数字と状態ラベルが小さくなりすぎないように調整

---

## 10. 画面要件と要求との対応

| 項目 | 内容 |
|---|---|
| 主要目的 | 進化的ミスマッチの可視化と改善介入の提案 |
| 主要ユーザー | 健康意識高いユーザー |
| 対象領域 | 食・運動・光・デジタル消費 |
| 主要アクション | ドメイン切替、介入トグル、リセット |
| 提供価値 | 理解しやすく、改善判断しやすい視覚化 |

---

## 11. Figma風の要素一覧

本画面は Figma のコンポーネント単位で整理すると、以下の要素群に分けられる。

### 11.1 全体構造
- Screen Canvas
- Header Block
- Top KPI Deck
- Domain Tab Bar
- Main Content Panel
- Footer Summary Bar

### 11.2 ヘッダー要素
- タイトルテキスト: "Evolutionary Mismatch Explorer"
- サブタイトルテキスト
- 背景カード（白/半透明）
- 影（soft elevation）

### 11.3 KPIカード要素
- Metric Card
  - Label
  - Value
  - Delta Text
  - Progress Bar
  - Status Text（High Risk / Moderate / Aligned）
- カードごとのスタイル差分
  - Mismatch Index: 赤系または黄系のバー
  - Well-Being Score: 緑系のバー
  - Active Mitigations: 青系のバー

### 11.4 ドメインタブ要素
- Tab Item
  - 通常時: グレー背景・テキスト中間色
  - 選択時: 青のアクセント背景・濃い文字
- 横スクロール許容領域
- 各項目のラベル

### 11.5 左パネル要素
- Section Card
- Domain Title
- Domain Subtitle
- Context Box
  - Ancestor Trait
  - Modern Trigger
  - 左アクセント線
- Interventions Section
  - Section Heading
  - Intervention Row
    - Intervention Name
    - Impact Text
    - Toggle Control

### 11.6 右パネル要素
- Section Card
- Biological Mechanisms Section
  - Mechanism Card
    - Tag
    - Mechanism Description
- Domain Indicators Section
  - Indicator Row
    - Name
    - Status Value

### 11.7 フッター要素
- Summary Text
- Reset Button

### 11.8 画面共通スタイル
- 角丸: 12〜18px
- 背景: オフホワイト〜薄グレー
- Border: 1px solid stroke
- Shadow: 低い軽い影
- Font: Google Sans Flex / sans-serif

---

## 12. 実装用のコンポーネント設計

以下は、Next.js / React で実装する際のコンポーネント分割案である。画面の責務を分離し、再利用性とメンテナンス性を確保する。

### 12.1 コンポーネント構成

#### 1) `DashboardShell`
- 役割: 画面の全体コンテナ
- 子要素:
  - `HeaderCard`
  - `MetricDeck`
  - `DomainTabs`
  - `MainContent`
  - `FooterSummary`

#### 2) `HeaderCard`
- Props:
  - `title: string`
  - `subtitle: string`
- 役割: 画面説明のヘッダー表示

#### 3) `MetricDeck`
- Props:
  - `metrics: { mismatch, wellbeing, activeCount, totalCount }`
- 子要素:
  - `MetricCard`

#### 4) `MetricCard`
- Props:
  - `label: string`
  - `value: string`
  - `delta: string`
  - `progress: number`
  - `tone: "red" | "green" | "blue"`
  - `statusText?: string`
- 役割: KPI の視覚表現

#### 5) `DomainTabs`
- Props:
  - `domains: Array<{ key: string; label: string }>`
  - `activeKey: string`
  - `onChange: (key: string) => void`
- 役割: ドメイン切り替え

#### 6) `MainContent`
- Props:
  - `domain: Domain`
  - `activeInterventions: string[]`
  - `onToggleIntervention: (id: string) => void`
- 子要素:
  - `DomainInfoPanel`
  - `MechanismPanel`

#### 7) `DomainInfoPanel`
- Props:
  - `title: string`
  - `subtitle: string`
  - `trait: string`
  - `trigger: string`
  - `interventions: Intervention[]`
  - `activeInterventions: string[]`
  - `onToggleIntervention: (id: string) => void`
- 役割: ドメイン説明と介入項目の表示

#### 8) `InterventionListItem`
- Props:
  - `name: string`
  - `impact: string`
  - `checked: boolean`
  - `onToggle: () => void`
- 役割: 1つの介入行を表現する

#### 9) `ToggleSwitch`
- Props:
  - `checked: boolean`
  - `onChange: () => void`
- 役割: ON/OFF switchの再利用可能UI

#### 10) `MechanismPanel`
- Props:
  - `mechanisms: string[]`
  - `indicators: Indicator[]`
  - `activeCount: number`
- 役割: 生理機序と状態指標の表示

#### 11) `MechanismCard`
- Props:
  - `label: string`
  - `text: string`
- 役割: メカニズム説明カード

#### 12) `IndicatorRow`
- Props:
  - `name: string`
  - `value: string`
  - `state: "good" | "warning"`
- 役割: 1つの指標の表示

#### 13) `FooterSummary`
- Props:
  - `summaryText: string`
  - `onReset: () => void`
- 役割: 状態要約とリセットボタン

### 12.2 型定義の例

```ts
type DomainKey = "nutrition" | "movement" | "light" | "attention";

type Intervention = {
  id: string;
  name: string;
  impact: string;
  wellbeingPts: number;
  mismatchPts: number;
  mechanism: string;
};

type Indicator = {
  name: string;
  base: string;
  active: string;
};

type Domain = {
  key: DomainKey;
  title: string;
  subtitle: string;
  trait: string;
  trigger: string;
  interventions: Intervention[];
  indicators: Indicator[];
};
```

### 12.3 状態管理の設計

#### 画面状態
```ts
const [selectedDomain, setSelectedDomain] = useState<DomainKey>("nutrition");
const [activeInterventions, setActiveInterventions] = useState<string[]>([]);
```

#### 計算ロジック
- `activeInterventions` をもとに、総合指標を再計算する
- ドメインは `selectedDomain` に応じて切り替える
- `calculateMetrics()` で以下を計算する
  - `mismatch`
  - `wellbeing`
  - `activeCount`
  - `statusText`

### 12.4 実装時の関心分離

- データ定義: `domains.ts`
- 表示コンポーネント: `components/dashboard/*`
- 画面ロジック: `app/page.tsx`
- スタイル: `app/globals.css`

例:
- `app/page.tsx`: 画面の state とデータ組み立て
- `components/dashboard/MetricCard.tsx`: KPIカード
- `components/dashboard/DomainTabs.tsx`: タブUI
- `components/dashboard/InterventionListItem.tsx`: 介入行
- `components/dashboard/MechanismPanel.tsx`: 生理機序セクション

### 12.5 実装上の注意

- 1つのコンポーネントには 1 つの責務に集中させる
- 表示ロジックと計算ロジックを分離する
- CSS の再利用性確保のため、汎用スタイルはクラスに寄せる
- ドメインごとの文言はデータとして管理し、UI から分離する

---

## 13. 実装上の注意事項

- すべてのカードとボタンは、機能説明が必要な領域にのみ情報を集約する
- 介入の説明文は簡潔にし、過剰な詳細を避ける
- 生理学的表現は教育的であり、誤った医療診断に繋がらないように表現を慎重にする
- 状態表現は、良し悪しではなく「最適化の状態」を中立的に伝える

---

## 14. まとめ

本画面は、単なる設定フォームではなく、「現代の生活習慣と生理学のズレ」を可視化し、改善の方向性を導く教育的ダッシュボードとして設計する。ユーザーは数値と介入の選択を通じて、自分の生活を小さく最適化できる体験を得る。

本モックアップにおける最大の価値は、以下の3点に集約される。

1. ミスマッチの状態を一目で理解できること
2. 生理学的理由と改善策を同時に示せること
3. 介入の選択が結果に直結する体験を提供できること
