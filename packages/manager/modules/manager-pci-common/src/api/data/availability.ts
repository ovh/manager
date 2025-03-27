import { v6 } from '@ovh-ux/manager-core-api';
import { TRegionBase } from '@/api/data/regions';

export type TProductAvailabilityRegion = TRegionBase & {
  datacenter: string;
  enabled: boolean;
};

export type TProductAvailability = {
  plans: {
    code: string;
    regions: TProductAvailabilityRegion[];
  }[];
  products: {
    name: string;
    regions: TProductAvailabilityRegion[];
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
