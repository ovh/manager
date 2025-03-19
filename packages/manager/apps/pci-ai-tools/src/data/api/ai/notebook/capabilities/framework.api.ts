import { apiClient } from '@ovh-ux/manager-core-api';
import { PCIAi } from '@/data/api';
import ai from '@/types/AI';

export const getFramework = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/notebook/capabilities/framework`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
      },
    })
    .then((res) => res.data as ai.capabilities.notebook.Framework[]);
