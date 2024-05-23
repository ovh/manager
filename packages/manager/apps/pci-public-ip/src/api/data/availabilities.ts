import { v6 } from '@ovh-ux/manager-core-api';
import { TRegion } from '@/api/types';

export type TAvailabilities = {
  plans: {
    code: string;
    regions: TRegion[];
  }[];
  products: [];
};

export const getAvailabilitiesUrl = (
  projectId: string,
  ovhSubsidiary: string,
) =>
  `/cloud/project/${projectId}/capabilities/productAvailability?ovhSubsidiary=${ovhSubsidiary}&planCode=floatingip.floatingip.hour.consumption`;

export const getAvailabilities = async (
  projectId: string,
  ovhSubsidiary: string,
): Promise<TAvailabilities> => {
  const { data } = await v6.get<TAvailabilities>(
    getAvailabilitiesUrl(projectId, ovhSubsidiary),
  );
  return data;
};
