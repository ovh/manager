import { v6 } from '@ovh-ux/manager-core-api';

export const getCloudCatalogUrl = (ovhSubsidiary: string) =>
  `/order/catalog/public/cloud?ovhSubsidiary=${ovhSubsidiary}&productName=cloud`;

export type TCloudCatalogResponse = {
  addons: {
    planCode: string;
    product: string;
    pricings: {
      capacities: string[];
      mode: string;
      price: number;
    }[];
    blobs: {
      technical: {
        bandwidth: {
          level: number;
        };
        model: string;
      };
      commercial: {
        price: {
          interval: string;
        };
      };
    };
  }[];
  catalogId: string;
  locale: {
    currencyCode: string;
    subsidiary: string;
    taxRate: number;
  };
  plans: {
    planCode: string;
    invoiceName: string;
    product: string;
    pricingType: string;
    consumptionConfiguration: string;
    pricings: {
      capacities: string[];
      mode: string;
    }[];
  }[];
};

export const getCloudCatalog = async (
  ovhSubsidiary: string,
): Promise<TCloudCatalogResponse> => {
  const { data } = await v6.get<TCloudCatalogResponse>(
    getCloudCatalogUrl(ovhSubsidiary),
  );
  return data;
};
