import { apiClient } from '@ovh-ux/manager-core-api';

import { ServiceData } from '.';
import { database } from '@/models/database';

export const getCertificate = async ({
  projectId,
  engine,
  serviceId,
}: ServiceData) =>
  apiClient.v6
    .get(
      `/cloud/project/${projectId}/database/${engine}/${serviceId}/certificates`,
    )
    .then((res) => res.data as database.service.Certificates);
