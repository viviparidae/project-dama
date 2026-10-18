"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import "./i18n";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DomainPanel } from "../components/dashboard/DomainPanel";
import { DomainTabs } from "../components/dashboard/DomainTabs";
import { FooterSummary } from "../components/dashboard/FooterSummary";
import { MechanismsPanel } from "../components/dashboard/MechanismsPanel";
import { MetricDeck } from "../components/dashboard/MetricDeck";
import { MicroMoveSettings } from "../components/dashboard/MicroMoveSettings";
import { LocaleSwitcher } from "../components/localeSwitcher";

const DOMAIN_KEYS = ["nutrition", "movement", "light", "attention"] as const;
type DomainKey = (typeof DOMAIN_KEYS)[number];

type Intervention = {
  id: string;
  nameKey: string;
  impactKey: string;
  wellbeingPts: number;
  mismatchPts: number;
  mechanismKey: string;
};

type Indicator = {
  nameKey: string;
  baseKey: string;
  activeKey: string;
};

type Domain = {
  key: DomainKey;
  titleKey: string;
  subtitleKey: string;
  traitKey: string;
  triggerKey: string;
  interventions: Intervention[];
  indicators: Indicator[];
};

const DOMAINS: Record<DomainKey, Domain> = {
  nutrition: {
    key: "nutrition",
    titleKey: "domains.nutrition.title",
    subtitleKey: "domains.nutrition.subtitle",
    traitKey: "domains.nutrition.trait",
    triggerKey: "domains.nutrition.trigger",
    indicators: [
      { nameKey: "indicators.postprandial.name", baseKey: "indicators.postprandial.base", activeKey: "indicators.postprandial.active" },
      { nameKey: "indicators.glpp.name", baseKey: "indicators.glpp.base", activeKey: "indicators.glpp.active" },
      { nameKey: "indicators.autophagy.name", baseKey: "indicators.autophagy.base", activeKey: "indicators.autophagy.active" },
    ],
    interventions: [
      {
        id: "nutr_circadian",
        nameKey: "interventions.nutr_circadian.name",
        impactKey: "interventions.nutr_circadian.impact",
        wellbeingPts: 18,
        mismatchPts: 15,
        mechanismKey: "interventions.nutr_circadian.mechanism",
      },
      {
        id: "nutr_wholefood",
        nameKey: "interventions.nutr_wholefood.name",
        impactKey: "interventions.nutr_wholefood.impact",
        wellbeingPts: 20,
        mismatchPts: 18,
        mechanismKey: "interventions.nutr_wholefood.mechanism",
      },
      {
        id: "nutr_hydration",
        nameKey: "interventions.nutr_hydration.name",
        impactKey: "interventions.nutr_hydration.impact",
        wellbeingPts: 10,
        mismatchPts: 8,
        mechanismKey: "interventions.nutr_hydration.mechanism",
      },
    ],
  },
  movement: {
    key: "movement",
    titleKey: "domains.movement.title",
    subtitleKey: "domains.movement.subtitle",
    traitKey: "domains.movement.trait",
    triggerKey: "domains.movement.trigger",
    indicators: [
      { nameKey: "indicators.glut4.name", baseKey: "indicators.glut4.base", activeKey: "indicators.glut4.active" },
      { nameKey: "indicators.spinal.name", baseKey: "indicators.spinal.base", activeKey: "indicators.spinal.active" },
      { nameKey: "indicators.mitochondria.name", baseKey: "indicators.mitochondria.base", activeKey: "indicators.mitochondria.active" },
    ],
    interventions: [
      {
        id: "mov_microburst",
        nameKey: "interventions.mov_microburst.name",
        impactKey: "interventions.mov_microburst.impact",
        wellbeingPts: 22,
        mismatchPts: 20,
        mechanismKey: "interventions.mov_microburst.mechanism",
      },
      {
        id: "mov_ground",
        nameKey: "interventions.mov_ground.name",
        impactKey: "interventions.mov_ground.impact",
        wellbeingPts: 14,
        mismatchPts: 12,
        mechanismKey: "interventions.mov_ground.mechanism",
      },
      {
        id: "mov_zone2",
        nameKey: "interventions.mov_zone2.name",
        impactKey: "interventions.mov_zone2.impact",
        wellbeingPts: 18,
        mismatchPts: 16,
        mechanismKey: "interventions.mov_zone2.mechanism",
      },
    ],
  },
  light: {
    key: "light",
    titleKey: "domains.light.title",
    subtitleKey: "domains.light.subtitle",
    traitKey: "domains.light.trait",
    triggerKey: "domains.light.trigger",
    indicators: [
      { nameKey: "indicators.melatonin.name", baseKey: "indicators.melatonin.base", activeKey: "indicators.melatonin.active" },
      { nameKey: "indicators.nrem.name", baseKey: "indicators.nrem.base", activeKey: "indicators.nrem.active" },
      { nameKey: "indicators.cortisol.name", baseKey: "indicators.cortisol.base", activeKey: "indicators.cortisol.active" },
    ],
    interventions: [
      {
        id: "light_sunlight",
        nameKey: "interventions.light_sunlight.name",
        impactKey: "interventions.light_sunlight.impact",
        wellbeingPts: 25,
        mismatchPts: 22,
        mechanismKey: "interventions.light_sunlight.mechanism",
      },
      {
        id: "light_nightshift",
        nameKey: "interventions.light_nightshift.name",
        impactKey: "interventions.light_nightshift.impact",
        wellbeingPts: 20,
        mismatchPts: 18,
        mechanismKey: "interventions.light_nightshift.mechanism",
      },
      {
        id: "light_thermal",
        nameKey: "interventions.light_thermal.name",
        impactKey: "interventions.light_thermal.impact",
        wellbeingPts: 15,
        mismatchPts: 12,
        mechanismKey: "interventions.light_thermal.mechanism",
      },
    ],
  },
  attention: {
    key: "attention",
    titleKey: "domains.attention.title",
    subtitleKey: "domains.attention.subtitle",
    traitKey: "domains.attention.trait",
    triggerKey: "domains.attention.trigger",
    indicators: [
      { nameKey: "indicators.prefrontal.name", baseKey: "indicators.prefrontal.base", activeKey: "indicators.prefrontal.active" },
      { nameKey: "indicators.dopamine.name", baseKey: "indicators.dopamine.base", activeKey: "indicators.dopamine.active" },
      { nameKey: "indicators.vagal.name", baseKey: "indicators.vagal.base", activeKey: "indicators.vagal.active" },
    ],
    interventions: [
      {
        id: "att_batching",
        nameKey: "interventions.att_batching.name",
        impactKey: "interventions.att_batching.impact",
        wellbeingPts: 22,
        mismatchPts: 20,
        mechanismKey: "interventions.att_batching.mechanism",
      },
      {
        id: "att_focus",
        nameKey: "interventions.att_focus.name",
        impactKey: "interventions.att_focus.impact",
        wellbeingPts: 18,
        mismatchPts: 16,
        mechanismKey: "interventions.att_focus.mechanism",
      },
      {
        id: "att_social",
        nameKey: "interventions.att_social.name",
        impactKey: "interventions.att_social.impact",
        wellbeingPts: 16,
        mismatchPts: 14,
        mechanismKey: "interventions.att_social.mechanism",
      },
    ],
  },
};

export default function Home() {
  const { t } = useTranslation();
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
    labelKey: `dashboard.tabs.${key}`,
  }));

  return (
    <main className="dashboard-shell">
      <div className="widget-container">
        <DashboardHeader
          title={t("dashboard.nav.title")}
          subtitle={t("dashboard.nav.subtitle")}
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
            title={t(domain.titleKey)}
            subtitle={t(domain.subtitleKey)}
            trait={t(domain.traitKey)}
            trigger={t(domain.triggerKey)}
            interventions={domain.interventions.map((i) => ({
              id: i.id,
              name: t(i.nameKey),
              impact: t(i.impactKey),
              mechanism: t(i.mechanismKey),
            }))}
            activeInterventions={activeInterventions}
            onToggleIntervention={toggleIntervention}
          />

          <MechanismsPanel
            indicators={domain.indicators.map((indicator) => ({
              name: t(indicator.nameKey),
              base: t(indicator.baseKey),
              active: t(indicator.activeKey),
            }))}
            interventions={domain.interventions.map((i) => ({
              id: i.id,
              name: t(i.nameKey),
              impact: t(i.impactKey),
              wellbeingPts: i.wellbeingPts,
              mismatchPts: i.mismatchPts,
              mechanism: t(i.mechanismKey),
            }))}
            activeInterventions={activeInterventions}
          />
        </div>

        <FooterSummary
          summaryKey="dashboard.summary.text"
          summaryValues={{
            count: metrics.activeCount,
            domains: 4,
            score: metrics.mismatch,
          }}
          onReset={() => setActiveInterventions([])}
        />

        <MicroMoveSettings />
      </div>
      <LocaleSwitcher />
    </main>
  );
}