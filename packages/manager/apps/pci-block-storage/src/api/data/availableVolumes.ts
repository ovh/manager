import { v6 } from '@ovh-ux/manager-core-api';

export type TAvailableVolumesResponse = {
  plans: {
    code: string;
    regions: {
      name: string;
      enabled: boolean;
    }[];
  }[];
};

export const getProjectsAvailableVolumes = async (
  projectId: string,
  ovhSubsidiary: string,
): Promise<TAvailableVolumesResponse> => {
  const { data } = await v6.get<TAvailableVolumesResponse>(
    `/cloud/project/${projectId}/capabilities/productAvailability?addonFamily=volume&ovhSubsidiary=${ovhSubsidiary}`,
  );

  return data;
};
