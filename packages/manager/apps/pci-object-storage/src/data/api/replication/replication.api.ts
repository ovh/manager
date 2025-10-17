import { StorageContainer } from '@datatr-ux/ovhcloud-types/cloud/index';
import { apiClient } from '../api.client';
import storages from '@/types/Storages';

export interface AddReplicationParams {
  projectId: string;
  region: string;
  name: string;
  replicationRule: storages.ReplicationRule;
}

export const addReplication = async ({
  projectId,
  region,
  name,
  replicationRule,
}: AddReplicationParams) => {
  const container = await apiClient.v6.get<StorageContainer>(
    `/cloud/project/${projectId}/region/${region}/storage/${name}`,
  );

  const existingRules = container.replication?.rules || [];
  const updatedRules = [...existingRules, replicationRule];

  return apiClient.v6.put<StorageContainer>(
    `/cloud/project/${projectId}/region/${region}/storage/${name}`,
    {
      replication: {
        rules: updatedRules,
      },
    },
  );
};

export interface UpdateReplicationParams {
  projectId: string;
  region: string;
  name: string;
  ruleId: string;
  replicationRule: storages.ReplicationRule;
}

export const updateReplication = async ({
  projectId,
  region,
  name,
  ruleId,
  replicationRule,
}: UpdateReplicationParams) => {
  const container = await apiClient.v6.get<StorageContainer>(
    `/cloud/project/${projectId}/region/${region}/storage/${name}`,
  );

  const existingRules = container.replication?.rules || [];
  const updatedRules = existingRules.map((rule) =>
    rule.id === ruleId ? replicationRule : rule,
  );

  return apiClient.v6.put<StorageContainer>(
    `/cloud/project/${projectId}/region/${region}/storage/${name}`,
    {
      replication: {
        rules: updatedRules,
      },
    },
  );
};

export interface DeleteReplicationParams {
  projectId: string;
  region: string;
  name: string;
  ruleId: string;
}

export const deleteReplication = async ({
  projectId,
  region,
  name,
  ruleId,
}: DeleteReplicationParams) => {
  const container = await apiClient.v6.get<StorageContainer>(
    `/cloud/project/${projectId}/region/${region}/storage/${name}`,
  );

  const existingRules = container.replication?.rules || [];
  const updatedRules = existingRules.filter((rule) => rule.id !== ruleId);

  return apiClient.v6.put<StorageContainer>(
    `/cloud/project/${projectId}/region/${region}/storage/${name}`,
    {
      replication: {
        rules: updatedRules,
      },
    },
  );
};
