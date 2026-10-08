"use client";

import { useMemo, useState } from "react";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { DomainPanel } from "../components/dashboard/DomainPanel";
import { DomainTabs } from "../components/dashboard/DomainTabs";
import { FooterSummary } from "../components/dashboard/FooterSummary";
import { MechanismsPanel } from "../components/dashboard/MechanismsPanel";
import { MetricDeck } from "../components/dashboard/MetricDeck";

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
    title: "Nutrition & Metabolism",
    subtitle: "Aligning nutrient density and meal timing with digestive biology.",
    trait: "Innate preference for sugar and fats to survive ancestral calorie scarcity.",
    trigger: "Continuous access to hyper-palatable, low-fiber, ultra-processed food.",
    indicators: [
      { name: "Postprandial Glycemic Spikes", base: "Elevated", active: "Optimized" },
      { name: "Endogenous GLP-1 Release", base: "Suppressed", active: "Stimulated" },
      { name: "Hepatic Autophagy", base: "Inhibited", active: "Restored" },
    ],
    interventions: [
      {
        id: "nutr_circadian",
        name: "Circadian Fasting Window (12-14h)",
        impact: "+18 Well-being | -15 Mismatch",
        wellbeingPts: 18,
        mismatchPts: 15,
        mechanism: "Restores hepatic clock gene expression & insular sensitivity during nocturnal phase.",
      },
      {
        id: "nutr_wholefood",
        name: "Whole Food Fiber-First Rule",
        impact: "+20 Well-being | -18 Mismatch",
        wellbeingPts: 20,
        mismatchPts: 18,
        mechanism: "Stimulates mucosal PYY & GLP-1 hormone release to signal hypothalamic satiety.",
      },
      {
        id: "nutr_hydration",
        name: "Pre-Meal Hydration Protocol",
        impact: "+10 Well-being | -8 Mismatch",
        wellbeingPts: 10,
        mismatchPts: 8,
        mechanism: "Prevents osmoregulatory thirst signals from being misinterpreted as caloric hunger.",
      },
    ],
  },
  movement: {
    key: "movement",
    title: "Movement & Biomechanics",
    subtitle: "Re-introducing physical variety and persistent low-intensity locomotion.",
    trait: "Energy conservation instinct during rest; built for walking 8-12km daily.",
    trigger: "Chaired desk work, static postures, and mechanized transportation.",
    indicators: [
      { name: "Muscle GLUT4 Translocation", base: "Minimal", active: "High Density" },
      { name: "Lumbar Spinal Compression", base: "High", active: "Relieved" },
      { name: "Mitochondrial Biogenesis", base: "Low", active: "Upregulated" },
    ],
    interventions: [
      {
        id: "mov_microburst",
        name: "Hourly Micro-Burst Movement",
        impact: "+22 Well-being | -20 Mismatch",
        wellbeingPts: 22,
        mismatchPts: 20,
        mechanism: "Triggers insulin-independent skeletal GLUT4 recruitment to clear plasma glucose.",
      },
      {
        id: "mov_ground",
        name: "Varied Posture & Floor Sitting",
        impact: "+14 Well-being | -12 Mismatch",
        wellbeingPts: 14,
        mismatchPts: 12,
        mechanism: "Engages deep hip rotators & spinal stabilizer musculature, restoring pelvic motility.",
      },
      {
        id: "mov_zone2",
        name: "Zone-2 Aerobic Locomotion",
        impact: "+18 Well-being | -16 Mismatch",
        wellbeingPts: 18,
        mismatchPts: 16,
        mechanism: "Promotes mitochondrial density and enhances fatty-acid beta-oxidation capacity.",
      },
    ],
  },
  light: {
    key: "light",
    title: "Light & Circadian Biology",
    subtitle: "Synchronizing central suprachiasmatic nucleus (SCN) clock with solar cycles.",
    trait: "Circadian entrainment driven by high-lux solar morning & dark dusk.",
    trigger: "Indoor low-lux days, artificial blue-rich LED exposure after sunset.",
    indicators: [
      { name: "Melatonin Suppression Peak", base: "Delayed", active: "Synchronized" },
      { name: "Nightly Deep NREM Sleep %", base: "11% (Suboptimal)", active: "22% (Optimal)" },
      { name: "Cortisol Awakening Response", base: "Blunted", active: "Robust" },
    ],
    interventions: [
      {
        id: "light_sunlight",
        name: "Morning Outdoor Sunlight (10m)",
        impact: "+25 Well-being | -22 Mismatch",
        wellbeingPts: 25,
        mismatchPts: 22,
        mechanism: "Activates ipRGC retinal cells to reset SCN master clock & trigger cortisol peak.",
      },
      {
        id: "light_nightshift",
        name: "Post-Sunset Warm Light Shift",
        impact: "+20 Well-being | -18 Mismatch",
        wellbeingPts: 20,
        mismatchPts: 18,
        mechanism: "Eliminates 460nm blue spectrum to allow pineal gland uninhibited melatonin production.",
      },
      {
        id: "light_thermal",
        name: "Cool Room Sleep Dip (18°C/65°F)",
        impact: "+15 Well-being | -12 Mismatch",
        wellbeingPts: 15,
        mismatchPts: 12,
        mechanism: "Facilitates requisite 1°C core body temperature drop for deep slow-wave sleep.",
      },
    ],
  },
  attention: {
    key: "attention",
    title: "Attention & Social Connection",
    subtitle: "Protecting cognitive focus and tribe-scale social interaction.",
    trait: "Tuned for immediate physical environment & small tribal affinity (~150 people).",
    trigger: "Hyper-stimulating algorithmic feeds, asynchronous notifications, social isolation.",
    indicators: [
      { name: "Prefrontal Cognitive Fatigue", base: "High", active: "Recovered" },
      { name: "Tonic Dopamine Baseline", base: "Depleted", active: "Restored" },
      { name: "Vagal Parasympathetic Tone", base: "Low", active: "Elevated" },
    ],
    interventions: [
      {
        id: "att_batching",
        name: "Batch Notification Pulses",
        impact: "+22 Well-being | -20 Mismatch",
        wellbeingPts: 22,
        mismatchPts: 20,
        mechanism: "Reduces sympathetic nervous system arousal and interrupts tonic dopamine depletion.",
      },
      {
        id: "att_focus",
        name: "Monotropic Focus Blocks (45m)",
        impact: "+18 Well-being | -16 Mismatch",
        wellbeingPts: 18,
        mismatchPts: 16,
        mechanism: "Eliminates attention residue from context switching, optimizing working memory.",
      },
      {
        id: "att_social",
        name: "Daily In-Person Micro-Affiliation",
        impact: "+16 Well-being | -14 Mismatch",
        wellbeingPts: 16,
        mismatchPts: 14,
        mechanism: "Triggers endogenous oxytocin synthesis and lowers amygdalar threat detection.",
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
    label: DOMAINS[key].title.split(" & ")[0],
  }));

  return (
    <main className="dashboard-shell">
      <div className="widget-container">
        <DashboardHeader
          title="Evolutionary Mismatch Explorer"
          subtitle="Align modern digital and physical behavior with ancestral human biology."
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
          summaryText={`${metrics.activeCount} interventions active across 4 domains. Mismatch score is ${metrics.mismatch}/100.`}
          onReset={() => setActiveInterventions([])}
        />
      </div>
    </main>
  );
}
