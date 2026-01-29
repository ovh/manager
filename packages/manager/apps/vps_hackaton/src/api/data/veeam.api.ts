import { v6 } from '@ovh-ux/manager-core-api';
import type { TVeeamBackup, TRestorePoint } from '@/domain/entities/veeam';
import type {
  TVeeamBackupDTO,
  TRestorePointDTO,
} from '@/adapters/api/veeam/dto.type';
import {
  mapVeeamBackupDtoToEntity,
  mapRestorePointDtoToEntity,
} from '@/adapters/api/veeam/mapper';
import type { TTask } from '@/domain/entities/task';

export const getVeeamBackup = async (
  serviceName: string,
): Promise<TVeeamBackup | null> => {
  try {
    const { data } = await v6.get<TVeeamBackupDTO>(
      `/vps/${serviceName}/automatedBackup`,
    );
    return mapVeeamBackupDtoToEntity(data);
  } catch (error) {
    // 404 means Veeam is not enabled
    return null;
  }
};

export const getRestorePoints = async (
  serviceName: string,
): Promise<Array<TRestorePoint>> => {
  const { data } = await v6.get<Array<TRestorePointDTO>>(
    `/vps/${serviceName}/automatedBackup/restorePoints`,
  );
  return data.map(mapRestorePointDtoToEntity);
};

export type TRestoreVeeamParams = {
  serviceName: string;
  restorePointId: string;
  changePassword?: boolean;
  export?: boolean;
  full?: boolean;
};

export const restoreVeeamBackup = async (
  params: TRestoreVeeamParams,
): Promise<TTask> => {
  const { data } = await v6.post<TTask>(
    `/vps/${params.serviceName}/automatedBackup/restore`,
    {
      restorePoint: params.restorePointId,
      changePassword: params.changePassword,
      export: params.export,
      full: params.full,
    },
  );
  return data;
};

export type TRescheduleVeeamParams = {
  serviceName: string;
  schedule: string;
};

export const rescheduleVeeamBackup = async (
  params: TRescheduleVeeamParams,
): Promise<void> => {
  await v6.post(`/vps/${params.serviceName}/automatedBackup/reschedule`, {
    schedule: params.schedule,
  });
};

export const detachVeeamBackup = async (serviceName: string): Promise<void> => {
  await v6.post(`/vps/${serviceName}/automatedBackup/detachBackup`);
};
