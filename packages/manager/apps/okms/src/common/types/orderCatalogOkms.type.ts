import { IntervalUnit } from '@ovh-ux/muk';

type OkmsCatalogPlanConfiguration = {
  isCustom: boolean;
  isMandatory: boolean;
  name: string;
  values: string[];
};

type OkmsCatalogPlan = {
  planCode: string;
  configurations: OkmsCatalogPlanConfiguration[];
  pricings: CatalogPricing[];
};

type CatalogPricing = {
  price: number;
  tax: number;
  phase: number;
  interval: number;
  intervalUnit: IntervalUnit;
};

type OkmsCatalogAddon = {
  planCode: string;
  invoiceName: string;
  product: string;
  pricingType: string;
  pricings: CatalogPricing[];
};

export type OkmsCatalog = {
  plans: OkmsCatalogPlan[];
  addons: OkmsCatalogAddon[];
};
