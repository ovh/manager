import { v6 } from '@ovh-ux/manager-core-api';
import { AGORA_ADDON_FAMILY } from '@/constants';

export type TPlanResponse = {
  plans: {
    code: string;
    regions: {
      continentCode: string;
      datacenter: string;
      enabled: boolean;
      name: string;
      type: string;
    }[];
  }[];
};

export const getPlans = async (
  projectId: string,
  ovhSubsidiary: string,
): Promise<TPlanResponse> => {
  const { data } = await v6.get<TPlanResponse>(
    `/cloud/project/${projectId}/capabilities/productAvailability?addonFamily=${AGORA_ADDON_FAMILY}&ovhSubsidiary=${ovhSubsidiary}`,
  );

  return data;
};
