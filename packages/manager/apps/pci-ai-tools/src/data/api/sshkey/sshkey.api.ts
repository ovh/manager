import { apiClient } from '@ovh-ux/manager-core-api';
import * as sshkey from '@datatr-ux/ovhcloud-types/cloud/index';
import { PCIAi } from '..';

export const getSshkey = async ({ projectId }: PCIAi) =>
  apiClient.v6
    .get(`/cloud/project/${projectId}/sshkey`, {
      headers: {
        'X-Pagination-Mode': 'CachedObjectList-Pages',
        'X-Pagination-Size': '50000',
      },
    })
    .then((res) => res.data as sshkey.sshkey.SshKey[]);

export interface AddSSHKey extends PCIAi {
  sshKey: sshkey.ProjectSshkeyCreation;
}

export const addSSHKey = async ({ projectId, sshKey }: AddSSHKey) =>
  apiClient.v6
    .post(`/cloud/project/${projectId}/sshkey`, sshKey)
    .then((res) => res.data as sshkey.sshkey.SshKeyDetail);
