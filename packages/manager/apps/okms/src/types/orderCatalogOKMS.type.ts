import { IntervalUnitType } from '@ovh-ux/manager-react-components';

type OKMSCatalogPlanConfiguration = {
  isCustom: boolean;
  isMandatory: boolean;
  name: string;
  values: string[];
};

type OKMSCatalogPlan = {
  planCode: string;
  configurations: OKMSCatalogPlanConfiguration[];
  pricings: CatalogPricing[];
};

type CatalogPricing = {
  price: number;
  tax: number;
  phase: number;
  interval: number;
  intervalUnit: IntervalUnitType;
};

type OKMSCatalogAddon = {
  planCode: string;
  invoiceName: string;
  product: string;
  pricingType: string;
  pricings: CatalogPricing[];
};

export type OKMSCatalog = {
  plans: OKMSCatalogPlan[];
  addons: OKMSCatalogAddon[];
};
