import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteReplication } from '@/data/api/replication/replication.api';
import { ObjStoError } from '@/data/api';

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
    mutationFn: deleteReplication,
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
