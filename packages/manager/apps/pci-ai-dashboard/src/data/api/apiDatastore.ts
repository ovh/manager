import { apiClient } from '@ovh-ux/manager-core-api';
import { PCIAi } from '.';
import { ai } from '@/types/ai';

interface GetDatastoresProps extends PCIAi {
  region: string;
}

export const getDatastores = async ({
  projectId,
  region,
}: GetDatastoresProps) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/ai/data/region/${region}/alias`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
        Pragma: 'no-cache',
      },
    })
    .then((res) => res.data as ai.DataStore[]);
