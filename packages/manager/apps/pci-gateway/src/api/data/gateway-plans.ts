import { v6 } from '@ovh-ux/manager-core-api';
import { RegionType } from '@/types/region';

export type TPlanRegion = {
  name: string;
  continentCode: string;
  datacenter: string;
  enabled: boolean;
  type: RegionType;
};

export type TPlan = {
  code: string;
  regions: TPlanRegion[];
};

export type TAvailableGatewayPlansResponse = {
  plans: TPlan[];
};

export const getAvailableGatewayPlans = async (
  projectId: string,
  ovhSubsidiary: string,
): Promise<TAvailableGatewayPlansResponse> => {
  const url = `/cloud/project/${projectId}/capabilities/productAvailability?ovhSubsidiary=${ovhSubsidiary}&addonFamily=gateway`;
  const { data } = await v6.get<TAvailableGatewayPlansResponse>(url);
  return data;
};
