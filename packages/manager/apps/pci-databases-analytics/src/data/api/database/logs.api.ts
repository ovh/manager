import { apiClient } from '@/data/api/api.client';
import * as database from '@/types/cloud/project/database';
import { ServiceData } from '.';

export const getServiceLogs = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<database.service.LogEntry[]>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/logs`,
  );
