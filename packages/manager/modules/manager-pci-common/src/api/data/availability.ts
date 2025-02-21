import { v6 } from '@ovh-ux/manager-core-api';

export type TRegionAvailability = {
  continentCode: 'ASIA' | 'EU' | 'NA' | 'US';
  datacenter: string;
  enabled: boolean;
  name: string;
  type: 'localzone' | 'region' | 'region-3-az';
};

export type TProductAvailability = {
  plans: {
    code: string;
    regions: TRegionAvailability[];
  }[];
  products: {
    name: string;
    regions: TRegionAvailability[];
  }[];
};

export type ProductAvailabilityFilter = {
  addonFamily?: string;
  planCode?: string;
  planFamily?: string;
  product?: string;
};

export const getProductAvailability = async (
  projectId: string,
  params: {
    ovhSubsidiary: string;
  } & ProductAvailabilityFilter,
): Promise<TProductAvailability> => {
  const { data } = await v6.get<TProductAvailability>(
    `/cloud/project/${projectId}/capabilities/productAvailability`,
    {
      params,
    },
  );
  return data;
};
