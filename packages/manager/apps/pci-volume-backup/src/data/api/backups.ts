import { v6 } from '@ovh-ux/manager-core-api';
import { TBackup } from '@/data/api/api.types';

export const getBackups = async (projectId: string): Promise<TBackup[]> => {
  const { data } = await v6.get(`/cloud/project/${projectId}/volume/backup`);
  return data;
};

export const getVolumeBackup = async (
  projectId: string,
  regionName: string,
  backupId: string,
): Promise<TBackup> => {
  const { data } = await v6.get(
    `/cloud/project/${projectId}/region/${regionName}/volumeBackup/${backupId}`,
  );
  return data;
};

export const deleteBackup = async (
  projectId: string,
  backupId: string,
): Promise<void> => {
  const { data } = await v6.delete(
    `/cloud/project/${projectId}/volume/backup/${backupId}`,
  );
  return data;
};
