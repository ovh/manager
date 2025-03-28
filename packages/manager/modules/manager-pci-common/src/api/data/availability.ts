import { v6 } from '@ovh-ux/manager-core-api';
import { TRegionBase } from '@/api/data/regions';

export type TRegionAvailability = TRegionBase & {
  datacenter: string;
  enabled: boolean;
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
