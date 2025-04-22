import apiClient from '@ovh-ux/manager-core-api';
import { Query } from '@tanstack/react-query';
import { TBackup, TVolumeBackup } from '@/data/api/api.types';
import { ApiData } from '@/data/hooks/useVolumeBackups';

const REFETCH_INTERVAL = 3500;

export const isVolumeBackupPending = (volumeBackup: TVolumeBackup) =>
  ['creating', 'deleting', 'restoring'].includes(volumeBackup.status);

export const refetchInterval = (
  query: Query<ApiData<TVolumeBackup[]>>,
): false | number => {
  return (
    query.state.data !== undefined &&
    query.state.data.data.some(isVolumeBackupPending) &&
    REFETCH_INTERVAL
  );
};

export const getVolumeBackups = (projectId: string) => async (): Promise<
  ApiData<TVolumeBackup[]>
> => {
  const data = await apiClient.v6.get(
    `/cloud/project/${projectId}/aggregated/volumeBackup`,
  );
  const { resources } = data.data;
  return {
    data: resources,
  };
};

export const getBackups = async (projectId: string) => {
  const { data } = await apiClient.v6.get<{ resources: TBackup[] }>(
    `/cloud/project/${projectId}/aggregated/volumeBackup`,
  );

  return data?.resources;
};

export const getVolumeBackup = async (
  projectId: string,
  regionName: string,
  volumeBackupId: string,
): Promise<TVolumeBackup> => {
  const data = await apiClient.v6.get(
    `/cloud/project/${projectId}/region/${regionName}/volumeBackup/${volumeBackupId}`,
  );
  return data.data;
};
