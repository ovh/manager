export const PLAN_CODES = [
  'mks.free.hour.consumption',
  'mks.standard.hour.consumption',
  'mks.standard.hour.consumption.3az',
] as const;
export type TPlanCode = (typeof PLAN_CODES)[number];

export type TCloudCatalogConsumptionConfiguration = {
  billingStrategy: string;
  prorataUnit: string;
  pingEndPolicy: unknown;
};

export type TCloudCatalogPricing = {
  phase: number;
  capacities: Array<string>;
  commitment: number;
  description: string;
  interval: number;
  intervalUnit: string;
  price: number;
  formattedPrice: string;
  tax: number;
  mode: string;
  strategy: string;
  mustBeCompleted: boolean;
  type: string;
};

export type TCloudCatalogPlan = {
  planCode: string;
  invoiceName: string;
  product: string;
  pricingType: string;
  consumptionConfiguration: TCloudCatalogConsumptionConfiguration | null;
  pricings: Array<TCloudCatalogPricing>;
};

export type CatalogPlanDictionnary = Partial<Record<TPlanCode, TCloudCatalogPlan>>;

export type TCloudCatalog = {
  entities: {
    plans: CatalogPlanDictionnary;
  };
};
