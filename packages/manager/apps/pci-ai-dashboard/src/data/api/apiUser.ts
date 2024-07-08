import { apiClient } from '@ovh-ux/manager-core-api';
import { PCIAi } from '.';
import { user } from '@/types/user';

export const getUsers = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/user`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
        Pragma: 'no-cache',
      },
    })
    .then((res) => res.data as user.User[]);
