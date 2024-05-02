import { v6 } from '@ovh-ux/manager-core-api';

export type TAvailableGatewayPlansResponse = {
  plans: {
    code: string;
    regions: {
      name: string;
      continentCode: string;
      datacenter: string;
      enabled: boolean;
    }[];
  }[];
};

export const getAvailableGatewayPlans = async (
  projectId: string,
  ovhSubsidiary: string,
): Promise<TAvailableGatewayPlansResponse> => {
  const url = `/cloud/project/${projectId}/capabilities/productAvailability?ovhSubsidiary=${ovhSubsidiary}&planFamily=gateway`;
  const { data } = await v6.get<TAvailableGatewayPlansResponse>(url);
  return data;
};
