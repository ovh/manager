import { v6 } from '@ovh-ux/manager-core-api';
import { TOperation } from '@/api/data/operation';

export type TVolumeSnapshot = {
  id: string;
  creationDate: string;
  description: string;
  name: string;
  planCode: string;
  region: string;
  size: number;
  status: string;
  volumeId: string;
};

export const getSnapshotsByRegion = async (
  projectId: string,
  region: string,
): Promise<TVolumeSnapshot[]> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/volume/snapshot`, {
    params: { region },
  });
  return data;
};

export const deleteSnapshots = async (
  projectId: string,
  volumeId: string,
  region: string,
) => {
  const { data } = await v6.post<TOperation>(
    `/cloud/project/${projectId}/region/${region}/volume/${volumeId}/bulkDeleteSnapshots`,
    {
      deleteAll: true,
    },
  );
  return data;
};
