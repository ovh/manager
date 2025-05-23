import { v6 } from '@ovh-ux/manager-core-api';
import { TVolume } from '@ovh-ux/manager-pci-common';

export type TNewVolumeData = Partial<TVolume> & { snapshotId?: string };

export const getVolume = async (
  projectId: string,
  volumeId: string,
): Promise<TVolume> => {
  const { data } = await v6.get<TVolume>(
    `/cloud/project/${projectId}/volume/${volumeId}`,
  );

  return data;
};

export async function createVolumeFromBackup(
  projectId: string,
  regionName: string,
  volumeBackupId: string,
  volumeName: string,
) {
  const {
    data,
  } = await v6.post(
    `/cloud/project/${projectId}/region/${regionName}/volumeBackup/${volumeBackupId}/volume`,
    { name: volumeName },
  );

  return data;
}

export const detachVolume = async (
  projectId: string,
  volumeId: string,
  instanceId: string,
): Promise<TVolume> => {
  const { data } = await v6.post(
    `/cloud/project/${projectId}/volume/${volumeId}/detach`,
    {
      instanceId,
    },
  );

  return data;
};
