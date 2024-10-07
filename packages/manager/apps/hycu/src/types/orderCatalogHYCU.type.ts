type HYCUCatalogPlanConfiguration = {
  isCustom: boolean;
  isMandatory: boolean;
  name: string;
  values: string[];
};

type HYCUCatalogPlanPricing = {
  price: number;
  intervalUnit: string;
  tax: number;
};

type HYCUCatalogPlan = {
  configurations: HYCUCatalogPlanConfiguration[];
  invoiceName: string;
  planCode: string;
  pricings: HYCUCatalogPlanPricing[];
};

export type HYCUCatalog = {
  plans: HYCUCatalogPlan[];
};
