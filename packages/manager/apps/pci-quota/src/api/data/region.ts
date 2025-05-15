import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { TRegion } from '@ovh-ux/manager-pci-common';

export const getAvailableRegions = async (
  projectId: string,
  disableCache = true,
): Promise<TRegion[]> => {
  const url = `/cloud/project/${projectId}/regionAvailable`;
  const { data } = await fetchIcebergV6<TRegion>({
    route: url,
    disableCache,
  });
  return data;
};
