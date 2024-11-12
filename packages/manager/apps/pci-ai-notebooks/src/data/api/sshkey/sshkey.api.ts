import { apiClient } from '@ovh-ux/manager-core-api';
import * as sshkey from '@/types/cloud/sshkey';
import { PCIAi } from '..';

export const getSshkey = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/sshkey`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
      },
    })
    .then((res) => res.data as sshkey.SshKey[]);

export interface AddSSHKey extends PCIAi {
  sshKey: sshkey.SshKey;
}

export const addSSHKey = async ({ projectId, sshKey }: AddSSHKey) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/sshkey`, sshKey)
    .then((res) => res.data as sshkey.SshKeyDetail);
