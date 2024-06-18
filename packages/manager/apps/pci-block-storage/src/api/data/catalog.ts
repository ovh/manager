import { v6 } from '@ovh-ux/manager-core-api';

export type TAddon = {
  product: string;
  pricings: TPricing[];
  planCode: string;
  invoiceName: string;
  pricingType: string;
  blobs: {
    technical: { bandwidth: { level: number } };
  };
};

export type TPricing = {
  capacities: string[];
  mode: string;
  phase: number;
  commitment: number;
  description: string;
  price: {
    currencyCode: string;
    text: string;
    value: number;
  };
  tax: number;
  interval: number;
  intervalUnit: string;
  quantity: {
    max?: number;
    min?: number;
  };
  repeat: {
    max?: number;
    min?: number;
  };
  strategy: string;
  mustBeCompleted: boolean;
  type: string;
  promotions: unknown[];
  engagementConfiguration?: unknown;
};

export type TAddonFamily = {
  addons: string[];
  default?: string;
  name: string;
  exclusive: boolean;
  mandatory: boolean;
};

type TPlan = {
  planCode: string;
  invoiceName: string;
  product: string;
  pricingType: string;
  consumptionConfiguration: string;
  pricings: TPricing[];
  addonFamilies: TAddonFamily[];
};

type TCatalog = {
  catalogId: string;
  locale: {
    currencyCode: string;
    subsidiary: string;
    taxRate: number;
  };
  plans: TPlan[];
  addons: TAddon[];
};

export const getCatalog = async (ovhSubsidiary: string): Promise<TCatalog> => {
  const { data } = await v6.get<TCatalog>(
    `/order/catalog/public/cloud?ovhSubsidiary=${ovhSubsidiary}&productName=cloud`,
  );
  return data;
};
