import { v6 } from '@ovh-ux/manager-core-api';
import { Query } from '@tanstack/react-query';
import { TVolumeBackup, TApiData } from '@/data/api/api.types';

const REFETCH_INTERVAL = 3500;

export const isVolumeBackupPending = (volumeBackup: TVolumeBackup) =>
  ['creating', 'deleting', 'restoring'].includes(volumeBackup.status);

export const refetchInterval = (
  query: Query<TApiData<TVolumeBackup>>,
): false | number => {
  return (
    query.state.data !== undefined &&
    query.state.data.data.some(isVolumeBackupPending) &&
    REFETCH_INTERVAL
  );
};

export const getVolumeBackups = (projectId: string) => async (): Promise<
  TApiData<TVolumeBackup>
> => {
  const data = await v6.get(
    `/cloud/project/${projectId}/aggregated/volumeBackup`,
  );
  const { resources } = data.data;
  return {
    data: resources,
  };
};

export const getVolumeBackup = async (
  projectId: string,
  regionName: string,
  volumeBackupId: string,
): Promise<TVolumeBackup> => {
  const data = await v6.get(
    `/cloud/project/${projectId}/region/${regionName}/volumeBackup/${volumeBackupId}`,
  );
  return data.data;
};

export const createVolumeBackup = async (
  projectId: string,
  volumeId: string,
  regionName: string,
  backupName: string,
): Promise<TVolumeBackup> => {
  const {
    data,
  } = await v6.post(
    `/cloud/project/${projectId}/region/${regionName}/volumeBackup`,
    { name: backupName, volumeId },
  );

  return data;
};

export const restoreVolume = async ({
  projectId,
  regionName,
  backupId,
  volumeId,
}: {
  projectId: string;
  regionName: string;
  backupId: string;
  volumeId: string;
}) => {
  const {
    data,
  } = await v6.post(
    `/cloud/project/${projectId}/region/${regionName}/volumeBackup/${backupId}/restore`,
    { volumeId },
  );

  return data;
};

export const deleteBackup = async ({
  projectId,
  regionName,
  backupId,
}: {
  projectId: string;
  regionName: string;
  backupId: string;
}) => {
  await v6.delete(
    `/cloud/project/${projectId}/region/${regionName}/volumeBackup/${backupId}`,
  );
};

export const createVolumeSnapshot = async (
  projectId: string,
  volumeId: string,
  backupName: string,
) => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/volume/${volumeId}/snapshot`,
    {
      name: backupName,
    },
  );

  return data;
};
