import { v6 } from '@ovh-ux/manager-core-api';

export type TCatalogAddonFamilies = {
  addons: string[];
  default: string | null;
  exclusive?: boolean;
  mandatory?: boolean;
  name: string;
};

export type TCatalogPlan = {
  planCode: string;
  addonFamilies: TCatalogAddonFamilies[];
};

export type TCatalogPricing = {
  capacities: string[];
  commitment: number;
  description: string;
  interval: number;
  intervalUnit: 'day' | 'hour' | 'month' | 'none';
  mode: string;
  price: number;
  promotions: unknown[];
  quantity: {
    min: number;
    max: number;
  };
  tax: number;
  type: 'consumption' | 'purchase' | 'rental';
};

export type TCatalogAddon = {
  planCode: string;
  addonFamilies: TCatalogAddonFamilies[];
  pricings: TCatalogPricing[];
};

export type TCatalog = {
  catalogId: number;
  addons: TCatalogAddon[];
  plans: TCatalogPlan[];
};

export const getCatalog = async (ovhSubsidiary: string) => {
  const { data } = await v6.get<TCatalog>(
    `/order/catalog/public/cloud?ovhSubsidiary=${ovhSubsidiary}&productName=cloud`,
  );
  return data;
};
