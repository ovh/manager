import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReplications } from '@/data/api/replication/replication.api';
import { ObjStoError } from '@/data/api';
import { getContainerHelper } from '../s3-storage/getContainerHelper';

export type DeleteReplicationParams = {
  projectId: string;
  region: string;
  name: string;
  ruleId: string;
};

type UseDeleteReplicationParams = {
  onSuccess?: () => void;
  onError?: (error: ObjStoError) => void;
};

export function useDeleteReplication({
  onSuccess,
  onError,
}: UseDeleteReplicationParams) {
  const queryClient = useQueryClient();

  const { mutate: deleteReplicationMutation, isPending } = useMutation({
    mutationFn: async (data: DeleteReplicationParams) => {
      const container = await getContainerHelper(
        queryClient,
        data.projectId,
        data.region,
        data.name,
      );

      const existingRules = container.replication?.rules || [];
      const updatedRules = existingRules.filter(
        (rule) => rule.id !== data.ruleId,
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

  return { deleteReplication: deleteReplicationMutation, isPending };
}
