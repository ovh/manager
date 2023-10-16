export type Translations = {
  advices_heading: string;
  advices_retention_heading: string;
  advices_recommender_system_know_more: string;
};

export type AdviceGroups = {
  adviceGroups: Advice[];
  featureAvailable: boolean;
  serviceName: string;
};

export type Advice = {
  advices: AdviceContent[];
  localizedDescription?: string;
};

export type AdviceContent = {
  href: string;
  external?: boolean;
  impression: {
    campaignId: string;
    creation: string;
    format: string;
    variant: string;
    generalPlacement: string;
    detailedPlacement: string;
  };
  name: string;
  localizedName: string;
};
