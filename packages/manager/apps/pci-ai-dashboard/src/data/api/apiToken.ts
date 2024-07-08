import { apiClient } from '@ovh-ux/manager-core-api';
import { ai } from '@/types/ai';
import { PCIAi } from '.';

export const getTokens = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/token`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
        Pragma: 'no-cache',
      },
    })
    .then((res) => res.data as ai.token.Token[]);
