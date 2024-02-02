import { apiClient } from '@ovh-ux/manager-core-api';
import { database } from '@/models/database';

export const getServiceBackups = async (
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/database/${engine}/${serviceId}/backup`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
        Pragma: 'no-cache',
      },
    })
    .then((res) => res.data as database.Backup[]);
