import { v6 } from '@ovh-ux/manager-core-api';
import type { TSnapshot } from '@/domain/entities/snapshot';
import type { TSnapshotDTO } from '@/adapters/api/snapshot/dto.type';
import { mapSnapshotDtoToEntity } from '@/adapters/api/snapshot/mapper';
import type { TTask } from '@/domain/entities/task';

export const getSnapshot = async (
  serviceName: string,
): Promise<TSnapshot | null> => {
  try {
    const { data } = await v6.get<TSnapshotDTO>(
      `/vps/${serviceName}/snapshot`,
    );
    return mapSnapshotDtoToEntity(data, serviceName);
  } catch (error) {
    // 404 means no snapshot exists
    return null;
  }
};

export type TCreateSnapshotParams = {
  serviceName: string;
  description?: string;
};

export const createSnapshot = async (
  params: TCreateSnapshotParams,
): Promise<TTask> => {
  const { data } = await v6.post<TTask>(
    `/vps/${params.serviceName}/createSnapshot`,
    {
      description: params.description,
    },
  );
  return data;
};

export const restoreSnapshot = async (serviceName: string): Promise<TTask> => {
  const { data } = await v6.post<TTask>(
    `/vps/${serviceName}/snapshot/revert`,
  );
  return data;
};

export const deleteSnapshot = async (serviceName: string): Promise<void> => {
  await v6.delete(`/vps/${serviceName}/snapshot`);
};

export const downloadSnapshot = async (serviceName: string): Promise<string> => {
  const { data } = await v6.get<{ url: string }>(
    `/vps/${serviceName}/snapshot/download`,
  );
  return data.url;
};
