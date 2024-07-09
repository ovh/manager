import { apiClient } from '@ovh-ux/manager-core-api';
import { PCIAi } from '.';
import { ai } from '@/types/ai';

export const getRegions = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/capabilities/region`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
        Pragma: 'no-cache',
      },
    })
    .then((res) => res.data as ai.capabilities.Region[]);