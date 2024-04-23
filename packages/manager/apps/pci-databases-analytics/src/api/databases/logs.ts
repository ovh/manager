import { apiClient } from '@ovh-ux/manager-core-api';
import { database } from '@/models/database';
import { ServiceData } from '.';

export const getServiceLogs = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/database/${engine}/${serviceId}/logs`)
    .then((res) => res.data as database.service.LogEntry[]);
