import { apiClient } from '@ovh-ux/manager-core-api';
import { PCIAi } from '..';
import * as ai from '@/types/cloud/project/ai';

export const getAuthorization = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/authorization`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
        Pragma: 'no-cache',
      },
    })
    .then((res) => res.data as ai.AuthorizationStatus);
