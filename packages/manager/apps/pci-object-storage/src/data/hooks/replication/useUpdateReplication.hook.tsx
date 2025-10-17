import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReplication } from '@/data/api/replication/replication.api';
import { ObjStoError } from '@/data/api';

type UseUpdateReplicationParams = {
  onSuccess?: () => void;
  onError?: (error: ObjStoError) => void;
};

export function useUpdateReplication({
  onSuccess,
  onError,
}: UseUpdateReplicationParams) {
  const queryClient = useQueryClient();

  const { mutate: updateReplicationMutation, isPending } = useMutation({
    mutationFn: updateReplication,
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
