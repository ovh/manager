import { v6 } from '@ovh-ux/manager-core-api';

export const getCatalogUrl = (ovhSubsidiary: string) =>
  `/order/catalog/public/cloud?ovhSubsidiary=${ovhSubsidiary}&productName=cloud`;

export type TAddon = {
  product: string;
  pricings: {
    capacities: string[];
    mode: string;
  }[];
  blobs: {
    technical: { bandwidth: { level: number } };
  };
};

export type TPricing = {
  capacities: string[];
  mode: string;
};

type TPlan = {
  planCode: string;
  invoiceName: string;
  product: string;
  pricingType: string;
  consumptionConfiguration: string;
  pricings: TPricing[];
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
  const { data } = await v6.get<TCatalog>(getCatalogUrl(ovhSubsidiary));
  return data;
};
