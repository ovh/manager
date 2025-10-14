import {
  apiClient,
  createHeaders,
  IcebergPaginationHeaders,
  NoCacheHeaders,
} from '@/data/api/api.client';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export const getServiceBackups = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<database.Backup[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/backup`,
    { headers: createHeaders(NoCacheHeaders, IcebergPaginationHeaders) },
  );

export interface RestoreBackup extends ServiceData {
  backupId?: string;
  restore?: database.service.Restore;
}
export const restoreBackup = async ({
  projectId,
  engine,
  serviceId,
  backupId,
  restore,
}: RestoreBackup) => {
  if (backupId) {
    return apiClient.v6.post<database.Backup>(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/backup/${backupId}/restore`,
    );
  }
  return apiClient.v6.post<database.Backup>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/restore`,
    {
      ...restore,
    },
  );
};
