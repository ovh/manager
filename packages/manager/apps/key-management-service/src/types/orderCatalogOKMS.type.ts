type OKMSCatalogPlanConfiguration = {
  isCustom: boolean;
  isMandatory: boolean;
  name: string;
  values: string[];
};

type OKMSCatalogPlan = {
  configurations: OKMSCatalogPlanConfiguration[];
};

export type OKMSCatalog = {
  plans: OKMSCatalogPlan[];
};
