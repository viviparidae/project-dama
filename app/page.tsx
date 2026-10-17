"use client";

import { useMemo, useState } from "react";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DomainPanel } from "../components/dashboard/DomainPanel";
import { DomainTabs } from "../components/dashboard/DomainTabs";
import { FooterSummary } from "../components/dashboard/FooterSummary";
import { MechanismsPanel } from "../components/dashboard/MechanismsPanel";
import { MetricDeck } from "../components/dashboard/MetricDeck";
import { t } from "../src/lib/i18n";

const DOMAIN_KEYS = ["nutrition", "movement", "light", "attention"] as const;
type DomainKey = (typeof DOMAIN_KEYS)[number];

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

const DOMAINS: Record<DomainKey, Domain> = {
  nutrition: {
    key: "nutrition",
    title: "栄養・代謝",
    subtitle: "栄養密度と食事タイミングを消化生物学に合わせる。",
    trait: "祖先のカロリー不足を生き延びるための、糖と脂肪への生来の嗜好。",
    trigger: "ハイパー・パラタブルで低繊維質の超加工食品への継続的アクセス。",
    indicators: [
      { name: "食後血糖値急上昇", base: "上昇", active: "最適化" },
      { name: "内因性 GLP-1 放出", base: "抑制", active: "刺激" },
      { name: "肝臓オートファジー", base: "阻害", active: "回復" },
    ],
    interventions: [
      {
        id: "nutr_circadian",
        name: "概日断食ウィンドウ（12-14時間）",
        impact: "+18 ウェルビーイング | -15 ミスマッチ",
        wellbeingPts: 18,
        mismatchPts: 15,
        mechanism: "夜間期における肝臓クロック遺伝子発現と島細胞感受性を回復する。",
      },
      {
        id: "nutr_wholefood",
        name: "ホールフード ファイバー・ファースト ルール",
        impact: "+20 ウェルビーイング | -18 ミスマッチ",
        wellbeingPts: 20,
        mismatchPts: 18,
        mechanism: "粘膜 PYY と GLP-1 ホルモン放出を刺激し、視床下部の満腹信号を伝える。",
      },
      {
        id: "nutr_hydration",
        name: "事前水分補給プロトコル",
        impact: "+10 ウェルビーイング | -8 ミスマッチ",
        wellbeingPts: 10,
        mismatchPts: 8,
        mechanism: "浸透圧調節の渇き信号が摂食信号と誤認されるのを防ぐ。",
      },
    ],
  },
  movement: {
    key: "movement",
    title: "運動・バイオメカニクス",
    subtitle: "身体の多様性と持続的な低強度 locomotion を再導入する。",
    trait: "休息時のエネルギー節約本能。1日 8-12km 歩行に適応。",
    trigger: "椅子でのデスクワーク、静止姿勢、機械化された移動手段。",
    indicators: [
      { name: "筋肉 GLUT4 トランスロケーション", base: "最小", active: "高密度" },
      { name: "腰椎圧迫", base: "高い", active: "緩和" },
      { name: "ミトコンドリア新生", base: "低い", active: "上昇" },
    ],
    interventions: [
      {
        id: "mov_microburst",
        name: "毎時マイクロバースト運動",
        impact: "+22 ウェルビーイング | -20 ミスマッチ",
        wellbeingPts: 22,
        mismatchPts: 20,
        mechanism: "インスリン非依存の骨格筋 GLUT4 動員をトリガーし、血漿グルコースを除去する。",
      },
      {
        id: "mov_ground",
        name: "多様な姿勢と床座り",
        impact: "+14 ウェルビーイング | -12 ミスマッチ",
        wellbeingPts: 14,
        mismatchPts: 12,
        mechanism: "深層股関節外旋筋と脊柱安定筋を動員し、骨盤運動性を回復する。",
      },
      {
        id: "mov_zone2",
        name: "ゾーン2 有酸素 locomotion",
        impact: "+18 ウェルビーイング | -16 ミスマッチ",
        wellbeingPts: 18,
        mismatchPts: 16,
        mechanism: "ミトコンドリア密度を促進し、脂肪酸β酸化能を高める。",
      },
    ],
  },
  light: {
    key: "light",
    title: "光・サーカディアン生物学",
    subtitle: "視床下部視交叉上核（SCN）クロックを太陽周期と同期する。",
    trait: "高ルクスの朝の太陽光と暗い夕暮れによる概日同期。",
    trigger: "屋内の低ルクスな日中、日没後のブルーリッチな人工 LED 曝露。",
    indicators: [
      { name: "メラトニン抑制ピーク", base: "遅延", active: "同期済み" },
      { name: "夜間深い NREM 睡眠率", base: "11% (非最適)", active: "22% (最適)" },
      { name: "起床時コルチゾール応答", base: "鈍化", active: "強固" },
    ],
    interventions: [
      {
        id: "light_sunlight",
        name: "朝の屋外日光浴（10分）",
        impact: "+25 ウェルビーイング | -22 ミスマッチ",
        wellbeingPts: 25,
        mismatchPts: 22,
        mechanism: "ipRGC 網膜細胞を活性化し SCN マスタークロックをリセットしコルチゾールピークを誘発する。",
      },
      {
        id: "light_nightshift",
        name: "日没後暖色光シフト",
        impact: "+20 ウェルビーイング | -18 ミスマッチ",
        wellbeingPts: 20,
        mismatchPts: 18,
        mechanism: "460nm ブルー波長を排除し、松果体のメラトニン産生を抑制なく可能にする。",
      },
      {
        id: "light_thermal",
        name: "涼しい部屋での睡眠ディップ（18°C/65°F）",
        impact: "+15 ウェルビーイング | -12 ミスマッチ",
        wellbeingPts: 15,
        mismatchPts: 12,
        mechanism: "深い徐波睡眠に必要な 1°C の深部体温低下を促進する。",
      },
    ],
  },
  attention: {
    key: "attention",
    title: "注意・社会的つながり",
    subtitle: "認知的焦点と部族規模の社会的相互作用を保護する。",
    trait: "直近の物理環境と小規模な部族親和（約150人）に最適化。",
    trigger: "ハイ・スタミュレイティングなアルゴリズムフィード、非同期通知、社会的孤立。",
    indicators: [
      { name: "前頭葉認知疲労", base: "高い", active: "回復" },
      { name: "トニックドーパミン基準値", base: "枯渇", active: "回復" },
      { name: "迷走神経副交感神経緊張", base: "低い", active: "高め" },
    ],
    interventions: [
      {
        id: "att_batching",
        name: "通知バッチ処理",
        impact: "+22 ウェルビーイング | -20 ミスマッチ",
        wellbeingPts: 22,
        mismatchPts: 20,
        mechanism: "交感神経系の興奮を軽減し、トニックなドーパミン枯渇を遮断する。",
      },
      {
        id: "att_focus",
        name: "単一焦点ブロック（45分）",
        impact: "+18 ウェルビーイング | -16 ミスマッチ",
        wellbeingPts: 18,
        mismatchPts: 16,
        mechanism: "コンテキストスイッチングによる注意残渣を排除し、ワーキングメモリを最適化する。",
      },
      {
        id: "att_social",
        name: "日々の対面マイクロ・アフィリエーション",
        impact: "+16 ウェルビーイング | -14 ミスマッチ",
        wellbeingPts: 16,
        mismatchPts: 14,
        mechanism: "内因性オキシトシン合成を誘発し、扁桃体の脅威検知を低下させる。",
      },
    ],
  },
};

export default function Home() {
  const [selectedDomain, setSelectedDomain] = useState<DomainKey>("nutrition");
  const [activeInterventions, setActiveInterventions] = useState<string[]>([]);

  const domain = DOMAINS[selectedDomain];

  const metrics = useMemo(() => {
    let wellbeing = 35;
    let mismatch = 85;
    let totalPossible = 0;

    Object.values(DOMAINS).forEach((item) => {
      totalPossible += item.interventions.length;
      item.interventions.forEach((intervention) => {
        if (activeInterventions.includes(intervention.id)) {
          wellbeing += intervention.wellbeingPts;
          mismatch -= intervention.mismatchPts;
        }
      });
    });

    wellbeing = Math.min(100, Math.max(0, wellbeing));
    mismatch = Math.max(5, Math.min(100, mismatch));

    return {
      wellbeing,
      mismatch,
      activeCount: activeInterventions.length,
      totalCount: totalPossible,
    };
  }, [activeInterventions]);

  const toggleIntervention = (id: string) => {
    setActiveInterventions((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const tabItems = DOMAIN_KEYS.map((key) => ({
    key,
    label: DOMAINS[key].title,
  }));

  return (
    <main className="dashboard-shell">
      <div className="widget-container">
        <DashboardHeader
          title={t("header.title")}
          subtitle={t("header.subtitle")}
        />

        <MetricDeck
          mismatch={metrics.mismatch}
          wellbeing={metrics.wellbeing}
          activeCount={metrics.activeCount}
          totalCount={metrics.totalCount}
        />

        <DomainTabs
          items={tabItems}
          activeKey={selectedDomain}
          onChange={(key) => setSelectedDomain(key as DomainKey)}
        />

        <div className="main-layout">
          <DomainPanel
            title={domain.title}
            subtitle={domain.subtitle}
            trait={domain.trait}
            trigger={domain.trigger}
            interventions={domain.interventions}
            activeInterventions={activeInterventions}
            onToggleIntervention={toggleIntervention}
          />

          <MechanismsPanel
            indicators={domain.indicators}
            interventions={domain.interventions}
            activeInterventions={activeInterventions}
          />
        </div>

        <FooterSummary
          summaryText={t("footer.interventionsActive", {
            activeCount: metrics.activeCount,
            mismatch: metrics.mismatch,
          })}
          onReset={() => setActiveInterventions([])}
        />
      </div>
    </main>
  );
}
