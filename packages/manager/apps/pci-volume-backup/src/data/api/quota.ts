import { v6 } from '@ovh-ux/manager-core-api';
import { TVolumePricing, TRegionQuota } from '@/data/api/api.types';
import { VOLUME_UNLIMITED_QUOTA } from '@/constants';

export const getRegionsQuota = async (
  projectId: string,
  region?: string,
): Promise<TRegionQuota> => {
  const { data } = await v6.get<TRegionQuota>(
    `/cloud/project/${projectId}/region/${region}/quota`,
  );
  return data;
};

export function getVolumeMaxSize(
  regionQuota: TRegionQuota,
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
