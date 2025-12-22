import { v6 } from '@ovh-ux/manager-core-api';

export type TAPIVolumeStatus =
  | 'available'
  | 'in-use'
  | 'creating'
  | 'attaching'
  | 'detaching'
  | 'deleting'
  | 'backing-up'
  | 'restoring-backup'
  | 'retyping'
  | 'snapshotting'
  | 'awaiting-transfer'
  | 'error'
  | 'error_deleting'
  | 'error_restoring'
  | 'error_extending'
  | string;

export type TAPIVolume = {
  id: string;
  attachedTo: string[];
  creationDate: string;
  name: string;
  description: string;
  size: number;
  status: TAPIVolumeStatus;
  region: string;
  bootable: boolean;
  planCode: string;
  type: string;
  availabilityZone: 'any' | string;
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

export type TUpdateVolumeProps = {
  projectId: string;
  volumeToUpdate: Partial<TAPIVolume>;
  originalVolume: Pick<TAPIVolume, 'id' | 'name' | 'bootable' | 'size'>;
};
export const updateVolume = async ({
  projectId,
  volumeToUpdate: { name, size, bootable },
  originalVolume,
}: TUpdateVolumeProps) => {
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
  region: string;
  size: number;
  type: string;
  availabilityZone: string | null;
}

export const addVolume = async ({
  projectId,
  region,
  ...props
}: AddVolumeProps): Promise<void> => {
  const { data } = await v6.post<void>(
    `/cloud/project/${projectId}/region/${region}/volume`,
    props,
  );

  return data;
};

export type TRetypeVolumeProps = {
  projectId: string;
  originalVolume: Pick<TAPIVolume, 'id' | 'region'>;
  newType: string;
};
export const retypeVolume = async ({
  projectId,
  originalVolume: { id, region },
  newType,
}: TRetypeVolumeProps) => {
  const { data } = await v6.put<void>(
    `/cloud/project/${projectId}/region/${region}/volume/${id}`,
    { type: newType },
  );

  return data;
};
