import { apiClient } from '@/data/api/api.client';
import { ServiceData } from '.';
import * as database from '@/types/cloud/project/database';

export const getCertificate = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6.get<database.service.Certificates>(
    `/cloud/project/${projectId}/database/${engine}/${serviceId}/certificates`,
  );
