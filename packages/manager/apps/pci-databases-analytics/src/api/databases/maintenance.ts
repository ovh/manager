import { apiClient } from '@ovh-ux/manager-core-api';
import { ServiceData } from '.';
import { database } from '@/models/database';

export const getMaintenance = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/maintenance`,
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    )
    .then((res) => res.data as database.service.Maintenance[]);

export interface ApplyMaintenanceProps extends ServiceData {
  maintenanceId: string;
}

export const applyMaintenance = async ({
  projectId,
  engine,
  serviceId,
  maintenanceId,
}: ApplyMaintenanceProps) =>
  apiClient.v6
    .post(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/maintenance/${maintenanceId}/apply`,
    )
    .then((res) => res.data as database.service.Maintenance);
