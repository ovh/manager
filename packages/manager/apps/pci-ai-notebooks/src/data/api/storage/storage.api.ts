import { apiClient } from '@ovh-ux/manager-core-api';
import { PCIAi } from '..';
import * as storage from '@/types/cloud/storage';

export const getStorage = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/storage`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
        Pragma: 'no-cache',
      },
    })
    .then((res) => res.data as storage.Container[]);
