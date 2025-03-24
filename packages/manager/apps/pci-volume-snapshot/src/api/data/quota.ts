import { v6 } from '@ovh-ux/manager-core-api';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { useMemo } from 'react';

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

function isLocalZone(region: string) {
  return region.split('-')[2] === 'LZ';
}

function getVolumeMaxSize(region: string) {
  return isLocalZone(region) ? 4 * 1000 : 12 * 1000;
}

export const FA_VOLUME_EXTEND_12TO = 'pci-block-storage:volume-extend-12To';
export const FA_EXTEN_BANNER = 'pci-block-storage:exten-banner';

export function useVolumeMaxSize(region: string | undefined) {
  const { data, ...restApi } = useFeatureAvailability([
    FA_VOLUME_EXTEND_12TO,
    FA_EXTEN_BANNER,
  ]);

  const volumeMaxSize = useMemo(() => {
    if (region && data?.[FA_VOLUME_EXTEND_12TO]) {
      return getVolumeMaxSize(region);
    }
    return 4 * 1000;
  }, [data, region]);

  return {
    ...restApi,
    volumeMaxSize,
  };
}
