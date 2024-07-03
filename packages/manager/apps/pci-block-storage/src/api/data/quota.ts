import { v6 } from '@ovh-ux/manager-core-api';

export interface RegionQuota {
  region: string;
  volume: {
    maxGigabytes: number;
    usedGigabytes: number;
    volumeCount: number;
    maxVolumeCount: number;
  };
}

export const getRegionsQuota = async (
  projectId: string,
): Promise<RegionQuota[]> => {
  const { data } = await v6.get<RegionQuota[]>(
    `/cloud/project/${projectId}/quota`,
  );
  return data;
};
