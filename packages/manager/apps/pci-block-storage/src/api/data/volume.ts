import { ApiResponse, isApiCustomError, v6 } from '@ovh-ux/manager-core-api';

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
  availabilityZone: string;
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

export const getVolume = async (projectId: string, volumeId: string): Promise<TAPIVolume> => {
  const { data } = await v6.get<TAPIVolume>(`/cloud/project/${projectId}/volume/${volumeId}`);
  return data;
};

export const getVolumeSnapshot = async (projectId: string): Promise<TVolumeSnapshot[]> => {
  const { data } = await v6.get<TVolumeSnapshot[]>(`/cloud/project/${projectId}/volume/snapshot`);
  return data;
};

export const getAllVolumes = async (projectId: string): Promise<TAPIVolume[]> => {
  const { data } = await v6.get<TAPIVolume[]>(`/cloud/project/${projectId}/volume`);
  return data;
};

export const deleteVolume = async (projectId: string, volumeId: string): Promise<null> => {
  try {
    const { data } = await v6.delete(`/cloud/project/${projectId}/volume/${volumeId}`);
    return data;
  } catch (e) {
    if (isApiCustomError(e)) {
      throw new Error(e.response?.data?.message || e.message);
    }
    if (e instanceof Error) {
      throw new Error(e.message);
    }
    throw new Error();
  }
};

export type TUpdateVolumeProps = {
  projectId: string;
  volumeToUpdate: Partial<TAPIVolume>;
  originalVolume: Pick<TAPIVolume, 'id' | 'name' | 'bootable' | 'size'>;
};
export const updateVolume = async ({
  projectId,
  volumeToUpdate: { name, size, bootable },
  originalVolume,
}: TUpdateVolumeProps): Promise<Array<ApiResponse<TAPIVolume>>> => {
  let promise1;
  let promise2;
  try {
    if (originalVolume.name !== name || originalVolume.bootable !== bootable) {
      promise1 = v6.put<TAPIVolume>(`/cloud/project/${projectId}/volume/${originalVolume.id}`, {
        name,
        bootable,
      });
    }
    if (size !== originalVolume.size) {
      promise2 = v6.post<TAPIVolume>(
        `/cloud/project/${projectId}/volume/${originalVolume.id}/upsize`,
        { size },
      );
    }
    const promises = [promise1, promise2].filter((promise) => !!promise);
    return await Promise.all(promises);
  } catch (e) {
    if (isApiCustomError(e)) {
      throw new Error(e.response?.data?.message || e.message);
    }
    if (e instanceof Error) {
      throw new Error(e.message);
    }
    throw new Error();
  }
};

export const attachVolume = async (projectId: string, volumeId: string, instanceId: string) => {
  try {
    const { data } = await v6.post<TAPIVolume>(
      `/cloud/project/${projectId}/volume/${volumeId}/attach`,
      {
        instanceId,
      },
    );
    return data;
  } catch (e) {
    if (isApiCustomError(e)) {
      throw new Error(e.response?.data?.message || e.message);
    } else if (e instanceof Error) {
      throw new Error(e.message);
    } else {
      throw new Error();
    }
  }
};

export const detachVolume = async (
  projectId: string,
  volumeId: string,
  instanceId: string,
): Promise<TAPIVolume> => {
  try {
    const { data } = await v6.post(`/cloud/project/${projectId}/volume/${volumeId}/detach`, {
      instanceId,
    });
    return data;
  } catch (e) {
    if (isApiCustomError(e)) {
      throw new Error(e.response?.data?.message || e.message);
    }
    if (e instanceof Error) {
      throw new Error(e.message);
    }
    throw new Error();
  }
};

export interface AddVolumeProps {
  name: string;
  projectId: string;
  region: string;
  size: number;
  type: string;
  availabilityZone: string | null;
}

export const addVolume = async ({ projectId, region, ...props }: AddVolumeProps): Promise<void> => {
  const { data } = await v6.post<void>(
    `/cloud/project/${projectId}/region/${region}/volume`,
    props,
  );

  return data;
};
