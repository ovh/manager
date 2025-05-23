import { v6 } from '@ovh-ux/manager-core-api';

export type TAPIVolume = {
  id: string;
  attachedTo: string[];
  creationDate: string;
  name: string;
  description: string;
  size: number;
  status: string;
  region: string;
  bootable: boolean;
  planCode: string;
  type: string;
  availabilityZone: 'any' | string;
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
): Promise<TAPIVolume> => {
  const { data } = await v6.get<TAPIVolume>(
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

export const getAllVolumes = async (
  projectId: string,
): Promise<TAPIVolume[]> => {
  const { data } = await v6.get<TAPIVolume[]>(
    `/cloud/project/${projectId}/volume`,
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

export const updateVolume = async (
  projectId: string,
  { name, bootable, size }: Partial<TAPIVolume>,
  originalVolume: TAPIVolume,
) => {
  let promise1;
  let promise2;
  try {
    if (originalVolume.name !== name || originalVolume.bootable !== bootable) {
      promise1 = v6.put(
        `/cloud/project/${projectId}/volume/${originalVolume.id}`,
        { name, bootable },
      );
    }
    if (size !== originalVolume.size) {
      promise2 = v6.post(
        `/cloud/project/${projectId}/volume/${originalVolume.id}/upsize`,
        { size },
      );
    }
    return await Promise.all([promise1, promise2]);
  } catch (e) {
    throw new Error(e.response?.data?.message || e.message);
  }
};

export const attachVolume = async (
  projectId: string,
  volumeId: string,
  instanceId: string,
): Promise<TAPIVolume> => {
  try {
    const { data } = await v6.post(
      `/cloud/project/${projectId}/volume/${volumeId}/attach`,
      {
        instanceId,
      },
    );
    return data;
  } catch (e) {
    throw new Error(e.response?.data?.message || e.message);
  }
};

export const detachVolume = async (
  projectId: string,
  volumeId: string,
  instanceId: string,
): Promise<TAPIVolume> => {
  try {
    const { data } = await v6.post(
      `/cloud/project/${projectId}/volume/${volumeId}/detach`,
      {
        instanceId,
      },
    );
    return data;
  } catch (e) {
    throw new Error(e.response?.data?.message || e.message);
  }
};

export interface AddVolumeProps {
  name: string;
  projectId: string;
  regionName: string;
  volumeCapacity: number;
  volumeType: string;
  availabilityZone: string | null;
}

export const addVolume = async ({
  name,
  projectId,
  regionName,
  volumeCapacity,
  volumeType,
  availabilityZone,
}: AddVolumeProps): Promise<void> => {
  const { data } = await v6.post<void>(
    `/cloud/project/${projectId}/region/${regionName}/volume`,
    {
      name,
      size: volumeCapacity,
      type: volumeType,
      availabilityZone,
    },
  );

  return data;
};
