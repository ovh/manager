import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReplications } from '@/data/api/replication/replication.api';
import { ObjStoError } from '@/data/api';
import storages from '@/types/Storages';
import { getContainerHelper } from '../s3-storage/getContainerHelper';

type UseAddReplicationParams = {
  onSuccess?: () => void;
  onError?: (error: ObjStoError) => void;
};

export interface AddReplicationParams {
  projectId: string;
  region: string;
  name: string;
  replicationRule: storages.ReplicationRule;
}

export function useAddReplication({
  onSuccess,
  onError,
}: UseAddReplicationParams) {
  const queryClient = useQueryClient();
  const { mutate: addReplicationMutation, isPending } = useMutation({
    mutationFn: async (data: AddReplicationParams) => {
      const container = await getContainerHelper(
        queryClient,
        data.projectId,
        data.region,
        data.name,
      );

      const existingRules = container.replication?.rules || [];
      const updatedRules = [...existingRules, data.replicationRule];

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

  return { addReplication: addReplicationMutation, isPending };
}
