import { v6 } from '@ovh-ux/manager-core-api';

export type TRegion = {
  continentCode: 'ASIA' | 'EU' | 'NA' | 'US';
  datacenter: string;
  enabled: boolean;
  name: string;
  type: 'localzone' | 'region';
};

export type TProductAvailability = {
  plans: {
    code: string;
    regions: TRegion[];
  }[];
  products: {
    name: string;
    regions: TRegion[];
  }[];
};

export const getProductAvailability = async (
  projectId: string,
  subsidiary: string,
): Promise<TProductAvailability> => {
  const { data } = await v6.get<TProductAvailability>(
    `/cloud/project/${projectId}/capabilities/productAvailability?ovhSubsidiary=${subsidiary}`,
  );
  return data;
};
