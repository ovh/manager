import { StorageContainer } from '@datatr-ux/ovhcloud-types/cloud';
import { apiClient } from '../api.client';
import storages from '@/types/Storages';

export interface UpdateReplicationsParams {
  projectId: string;
  region: string;
  name: string;
  replicationRules: storages.ReplicationRule[];
}

export const updateReplications = async ({
  projectId,
  region,
  name,
  replicationRules,
}: UpdateReplicationsParams) => {
  return apiClient.v6.put<StorageContainer>(
    `/cloud/project/${projectId}/region/${region}/storage/${name}`,
    {
      replication: {
        rules: replicationRules,
      },
    },
  );
};
