import { IntervalUnitType } from '@ovh-ux/manager-react-components';

type HYCUCatalogPlanConfiguration = {
  isCustom: boolean;
  isMandatory: boolean;
  name: string;
  values: string[];
};

export type HYCUCatalogPlanPricing = {
  capacities: ['installation' | 'upgrade' | 'renew'];
  price: number;
  intervalUnit: IntervalUnitType;
  tax: number;
};

export type HYCUCatalogPlan = {
  configurations: HYCUCatalogPlanConfiguration[];
  invoiceName: string;
  planCode: string;
  pricings: HYCUCatalogPlanPricing[];
};

export type HYCUCatalog = {
  plans: HYCUCatalogPlan[];
};
