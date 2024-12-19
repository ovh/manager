import { v6 } from '@ovh-ux/manager-core-api';
import { TLocalisation } from '@/api/hooks/useRegions';

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

export function isRegionWith3AZ(region: TLocalisation) {
  return region.type === 'region-3-az';
}

/**
 * TODO: use real informations
 * @param planCode
 */
export function isProductWithAvailabilityZone(planCode: string) {
  return planCode.startsWith('volume.high-speed');
}
