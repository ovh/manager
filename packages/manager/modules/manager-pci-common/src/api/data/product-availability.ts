import { v6 } from '@ovh-ux/manager-core-api';

export interface ProductPlan {
  code: string;
  regions: {
    name: string;
    datacenter: string;
    continentCode: 'ASIA' | 'EU' | 'NA' | 'US';
    enabled: boolean;
    type: 'localzone' | 'region' | 'region-multizone';
  }[];
}

export interface ProductsAvailability {
  plans: ProductPlan[];
}

export interface ProductAvailabilitySearchParams {
  addonFamily?: string;
  planCode?: string;
  product?: string;
}

export const getProductsAvailabilities = async (
  projectId: string,
  ovhSubsidiary: string,
  params: ProductAvailabilitySearchParams,
): Promise<ProductsAvailability> => {
  const { data } = await v6.get<ProductsAvailability>(
    `/cloud/project/${projectId}/capabilities/productAvailability`,
    {
      params: {
        ovhSubsidiary,
        ...params,
      },
    },
  );
  return data;
};
