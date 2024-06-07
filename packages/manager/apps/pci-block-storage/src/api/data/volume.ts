import { v6 } from '@ovh-ux/manager-core-api';

export type TVolume = {
  id: string;
  bootable: boolean;
  creationDate: string;
  description: string;
  name: string;
  planCode: string;
  region: string;
  size: number;
  status: string;
  type: string;
  attachedTo: string[];
};

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

export const getVolume = async (
  projectId: string,
  volumeId: string,
): Promise<TVolume> => {
  const { data } = await v6.get<TVolume>(
    `/cloud/project/${projectId}/volume/${volumeId}`,
  );
  return data;
};

export const getVolumeSnapshot = async (
  projectId: string,
): Promise<TVolumeSnapshot[]> => {
  const { data } = await v6.get<TVolumeSnapshot[]>(
    `/cloud/project/${projectId}/volume/snapshot`,
  );
  return data;
};

export const deleteVolume = async (
  projectId: string,
  volumeId: string,
): Promise<null> => {
  try {
    const { data } = await v6.delete(
      `/cloud/project/${projectId}/volume/${volumeId}`,
    );
    return data;
  } catch (e) {
    throw new Error(e.response?.data?.message || e.message);
  }
};
