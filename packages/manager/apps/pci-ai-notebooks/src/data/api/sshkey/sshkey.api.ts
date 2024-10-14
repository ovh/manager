import { apiClient } from '@ovh-ux/manager-core-api';
import * as sshkey from '@/types/cloud/sshkey';
import { PCIAi } from '..';

export const getSshkey = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/sshkey`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
        Pragma: 'no-cache',
      },
    })
    .then((res) => res.data as sshkey.SshKey[]);
