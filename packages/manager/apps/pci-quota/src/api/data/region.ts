import { v6 } from '@ovh-ux/manager-core-api';
import { TRegion } from '@ovh-ux/manager-pci-common';

export const getAvailableRegions = async (
  projectId: string,
): Promise<TRegion[]> => {
  const url = `/cloud/project/${projectId}/regionAvailable`;
  const { data } = await v6.get<TRegion[]>(url, {
    headers: {
      'X-Pagination-Mode': 'CachedObjectList-Pages',
    },
  });

  return data;
};
