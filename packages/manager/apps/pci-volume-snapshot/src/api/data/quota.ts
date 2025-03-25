import { v6 } from '@ovh-ux/manager-core-api';
import { TVolumePricing } from '@/api/data/catalog';
import { VOLUME_UNLIMITED_QUOTA } from '@/constants';

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
  region?: string,
): Promise<RegionQuota> => {
  const { data } = await v6.get<RegionQuota>(
    `/cloud/project/${projectId}/region/${region}/quota`,
  );
  return data;
};

export function getVolumeMaxSize(
  regionQuota: RegionQuota,
  pricing: TVolumePricing,
): number {
  let availableGigabytes = pricing.specs.volume?.capacity.max || 0;
  if (regionQuota.volume.maxGigabytes !== VOLUME_UNLIMITED_QUOTA) {
    const remainingGigabytes =
      regionQuota.volume.maxGigabytes - regionQuota.volume.usedGigabytes;
    availableGigabytes = Math.min(availableGigabytes, remainingGigabytes);
  }
  return availableGigabytes;
}
