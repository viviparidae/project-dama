export const locale = "ja" as const;

export const messages = {
  common: {
    resetAllStates: "すべての状態をリセット",
  },
  header: {
    title: "進化的ミスマッチ エクスプローラー",
    subtitle: "現代のデジタル・物理行動を、祖先の人間の生物学に合わせる。",
  },
  domainPanel: {
    ancestralTrait: "先祖代々の特性",
    modernTrigger: "現代のトリガー",
    targetedInterventions: "対象介入",
  },
  mechanismsPanel: {
    biologicalMechanisms: "生物学的メカニズム",
    mechanismSubtitle: "アクティブな習慣によって引き起こされる生理的適応。",
    mechanismTag: "{name} メカニズム",
    emptyMechanisms: "上記の介入を切り替えて生物学的経路を明らかにする。",
    domainIndicators: "ドメイン指標",
  },
  metricDeck: {
    mismatchIndex: "ミスマッチ指数",
    wellBeingScore: "ウェルビーイングスコア",
    activeMitigations: "アクティブな緩和策",
    highMismatch: "ミスマッチ度: 高",
    aligned: "整合済み",
    moderate: "中程度",
  },
  footer: {
    interventionsActive:
      "{activeCount} 件の介入が 4 ドメインにわたってアクティブです。ミスマッチスコアは {mismatch}/100 です。",
  },
} as const;

export function t(
  key: string,
  params?: Record<string, string | number>,
): string {
  const parts = key.split(".");
  let value: unknown = messages;
  for (const part of parts) {
    value = (value as Record<string, unknown>)?.[part];
  }
  if (typeof value !== "string") {
    return key;
  }

  let result = value as string;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      result = result.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    });
  }

  return result;
}
