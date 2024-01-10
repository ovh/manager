import { apiClient } from '@ovh-ux/manager-core-api';
import { database } from '@/models/database';

// define which values can be updated in the update service endpoint
export interface UpdateServiceProps {
  projectId: string;
  serviceEngine: string;
  serviceId: string;
  data: Partial<
    Pick<
      database.Service,
      | 'backupTime'
      | 'backups'
      | 'description'
      | 'flavor'
      | 'ipRestrictions'
      | 'maintenanceTime'
      | 'plan'
      | 'region'
      | 'storage'
      | 'version'
    >
  >;
}

export const cdbApi = {
  getServices: async (projectId: string) =>
    apiClient.v6
      .get(`/cloud/project/${projectId}/database/service`, {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      })
      .then((res) => res.data as database.Service[]),
  getService: async (projectId: string, serviceId: string) =>
    apiClient.v6
      .get(`/cloud/project/${projectId}/database/service/${serviceId}`)
      .then((res) => res.data as database.Service),
  getMetrics: async (projectId: string, engine: string, serviceId: string) =>
    apiClient.v6
      .get(
        `/cloud/project/${projectId}/database/${engine}/${serviceId}/metric?extended=false`,
      )
      .then((res) => res.data as string[]),
  getMetric: async (
    projectId: string,
    engine: string,
    serviceId: string,
    metric: string,
    period: database.service.MetricPeriodEnum,
  ) =>
    apiClient.v6
      .get(
        `/cloud/project/${projectId}/database/${engine}/${serviceId}/metric/${metric}?period=${period}`,
      )
      .then((res) => res.data as database.service.Metric),
  getAvailabilities: async (
    projectId: string,
    status: database.availability.StatusEnum[] = [
      database.availability.StatusEnum.STABLE,
      database.availability.StatusEnum.BETA,
    ],
  ) => {
    const headers: Record<string, string> = {
      'X-Pagination-Mode': 'CachedObjectList-Pages',
      'X-Pagination-Size': '50000',
    };
    if (status.length > 0) {
      headers['X-Pagination-Filter'] =
        status.length === 1
          ? `lifecycle.status:eq=${status[0]}`
          : `lifecycle.status:in=${status.join(',')}`;
    }
    return apiClient.v6
      .get(`/cloud/project/${projectId}/database/availability`, {
        headers,
      })
      .then((res) => res.data as database.Availability[]);
  },
  getCapabilities: async (projectId: string) =>
    apiClient.v6
      .get(`/cloud/project/${projectId}/database/capabilities`)
      .then((res) => res.data as database.Capabilities),
  updateService: async ({
    projectId,
    serviceEngine,
    serviceId,
    data,
  }: UpdateServiceProps) => {
    await apiClient.v6
      .put(
        `/cloud/project/${projectId}/database/${serviceEngine}/${serviceId}`,
        data,
      )
      .then((res) => res.data as database.Service[]);
  },
};
