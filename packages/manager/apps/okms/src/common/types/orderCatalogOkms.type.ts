import { IntervalUnitType } from '@ovh-ux/manager-react-components';

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
  intervalUnit: IntervalUnitType;
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
