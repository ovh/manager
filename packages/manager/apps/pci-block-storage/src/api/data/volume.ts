import { v6 } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@ovhcloud/manager-components';
import { Instance } from '@/api/data/instance';

export type TVolume = {
  id: string;
  attachedTo: string[];
  instances?: Instance[];
  creationDate: string;
  name: string;
  description: string;
  size: number;
  status: string;
  statusGroup: string;
  region: string;
  bootable: boolean;
  planCode: string;
  type: string;
  regionName: string;
};

export type VolumeOptions = {
  pagination: PaginationState;
  sorting: ColumnSort;
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

export const getAllVolumes = async (projectId: string): Promise<TVolume[]> => {
  const { data } = await v6.get<TVolume[]>(
    `/cloud/project/${projectId}/volume`,
  );
  return data;
};

export const paginateResults = <T>(
  items: T[],
  pagination: PaginationState,
) => ({
  rows: items.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  ),
  pageCount: Math.ceil(items.length / pagination.pageSize),
  totalRows: items.length,
});

export const sortResults = (items: TVolume[], sorting: ColumnSort) => {
  let data = [...items];
  if (sorting?.id === 'attachedTo') {
    return data;
  }
  switch (sorting?.id) {
    case 'size':
      data = [...items].sort((a, b) => (a.size > b.size ? 1 : 0));
      break;
    case 'status':
      data = [...items].sort((a, b) => (a.statusGroup > b.statusGroup ? 1 : 0));
      break;
    default:
      break;
  }

  if (sorting) {
    const { desc } = sorting;

    if (desc) {
      data.reverse();
    }
  }
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
  { name, bootable, size }: TVolume,
  originalVolume: TVolume,
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
): Promise<TVolume> => {
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
): Promise<TVolume> => {
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
}

export const addVolume = async ({
  name,
  projectId,
  regionName,
  volumeCapacity,
  volumeType,
}: AddVolumeProps): Promise<void> => {
  const { data } = await v6.post<void>(`/cloud/project/${projectId}/volume`, {
    name,
    region: regionName,
    size: volumeCapacity,
    type: volumeType,
  });

  return data;
};
