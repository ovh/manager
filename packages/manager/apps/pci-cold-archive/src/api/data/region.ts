import { v6 } from '@ovh-ux/manager-core-api';
import { TRegion } from '@ovh-ux/manager-react-components';

export const getProjectRegionDetails = async (
  projectId: string,
  region: string,
): Promise<TRegion> => {
  const { data } = await v6.get<TRegion>(
    `/cloud/project/${projectId}/region/${region}`,
  );
  return data;
};

export type TProductRegionAvailability = {
  plans: { code: string; regions: string[] }[];
  products: {
    name: string;
    regions: string[];
  }[];
};

export const getProductRegionsAvailability = async (
  ovhSubsidiary: string,
  planCode: string,
): Promise<string[]> => {
  const { data } = await v6.get<TProductRegionAvailability>(
    `/cloud/order/rule/availability?ovhSubsidiary=${ovhSubsidiary}&planCode=${planCode}`,
  );
  return data?.plans[0]?.regions;
};
