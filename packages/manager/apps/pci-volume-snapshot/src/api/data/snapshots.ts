import { v6 } from '@ovh-ux/manager-core-api';
import { TSnapshot, TVolume } from '@/api/api.types';

export const getSnapshots = async (projectId: string): Promise<TSnapshot[]> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/volume/snapshot`);
  return data;
};

export const getVolume = async (
  projectId: string,
  snapshotId: string,
): Promise<TVolume> => {
  const { data } = await v6.get(
    `/cloud/project/${projectId}/volume/${snapshotId}`,
  );
  return data;
};
