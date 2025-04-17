import { fetchIcebergV6, v6 } from '@ovh-ux/manager-core-api';
import { TBackup } from '@/data/api/api.types';

/**
 *  Get listing with iceberg V6
 */
export const getListingIcebergV6 = async ({
  projectId,
  pageSize,
  page,
}: {
  projectId: string;
  pageSize: number;
  page: number;
}) => {
  const { data, status, totalCount } = await fetchIcebergV6({
    route: `/cloud/project/${projectId}/aggregated/volumeBackup`,
    pageSize,
    page,
  });
  if (status > 400) {
    throw new Error();
  }
  return { data, status, totalCount };
};

export const getBackups = async (projectId: string) => {
  const { data, status } = await v6.get<{ resources: TBackup[] }>(
    `/cloud/project/${projectId}/aggregated/volumeBackup`,
  );

  return data?.resources;
};
