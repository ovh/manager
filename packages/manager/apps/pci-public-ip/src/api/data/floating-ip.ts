import { v6 } from '@ovh-ux/manager-core-api';
import { PaginationState } from '@ovhcloud/manager-components';
import { FloatingIP, Instance } from '@/interface';

/**
 * TODO: make it generic in the manager-components as hook
 */
export const paginateResults = (
  items: FloatingIP[],
  pagination: PaginationState,
) => {
  return {
    rows: items.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize,
    ),
    pageCount: Math.ceil(items.length / pagination.pageSize),
    totalRows: items.length,
  };
};

export const getAllFloatingIP = async (
  projectId: string,
): Promise<FloatingIP[]> => {
  const [
    { data: instances },
    {
      data: { resources: floatingIPs },
    },
  ] = await Promise.all([
    v6.get(`/cloud/project/${projectId}/instance`),
    v6.get(`/cloud/project/${projectId}/aggregated/floatingip`),
  ]);

  const aggregatedData = floatingIPs.map((floatingIP) => {
    const floatingIPResult = { ...floatingIP };
    if (
      floatingIP.associatedEntity &&
      floatingIP.associatedEntity?.type === 'instance'
    ) {
      const instance: Instance = instances.find(
        ({ id }) => id === floatingIP.associatedEntity.id,
      );

      floatingIPResult.associatedEntity.name = instance ? instance.name : '';
    }

    return { ...floatingIPResult };
  });

  return aggregatedData;
};

export default { getAllFloatingIP };
