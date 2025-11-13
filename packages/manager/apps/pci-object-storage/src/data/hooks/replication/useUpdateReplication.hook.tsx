import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReplications } from '@/data/api/replication/replication.api';
import { ObjStoError } from '@/data/api';
import storages from '@/types/Storages';
import { getContainerHelper } from '../s3-storage/getContainerHelper';

type UseUpdateReplicationParams = {
  onSuccess?: () => void;
  onError?: (error: ObjStoError) => void;
};

export interface UpdateReplicationParams {
  projectId: string;
  region: string;
  name: string;
  replicationRule: storages.ReplicationRule;
}

export function useUpdateReplication({
  onSuccess,
  onError,
}: UseUpdateReplicationParams) {
  const queryClient = useQueryClient();

  const { mutate: updateReplicationMutation, isPending } = useMutation({
    mutationFn: async (data: UpdateReplicationParams) => {
      const container = await getContainerHelper(
        queryClient,
        data.projectId,
        data.region,
        data.name,
      );

      const existingRules = container.replication?.rules || [];
      const updatedRules = existingRules.map((rule) =>
        rule.id === data.replicationRule.id ? data.replicationRule : rule,
      );

      return updateReplications({
        projectId: data.projectId,
        region: data.region,
        name: data.name,
        replicationRules: updatedRules,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'region',
          variables.region,
          'storage',
          variables.name,
        ],
      });
      onSuccess?.();
    },
    onError,
  });

  return { updateReplication: updateReplicationMutation, isPending };
}
