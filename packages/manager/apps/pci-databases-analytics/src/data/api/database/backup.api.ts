import { apiClient } from '@ovh-ux/manager-core-api';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export const getServiceBackups = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/database/${engine}/${serviceId}/backup`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
        Pragma: 'no-cache',
      },
    })
    .then((res) => res.data as database.Backup[]);

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
    return apiClient.v6
      .post(
        `/cloud/project/${projectId}/database/${engine}/${serviceId}/backup/${backupId}/restore`,
      )
      .then((res) => res.data as database.Backup);
  }
  return apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/restore`,
      {
        ...restore,
      },
    )
    .then((res) => res.data as database.Backup);
};
