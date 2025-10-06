import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addReplication } from '@/data/api/replication/replication.api';
import { ObjStoError } from '@/data/api';

type UseAddReplicationParams = {
  onSuccess?: () => void;
  onError?: (error: ObjStoError) => void;
};

export function useAddReplication({
  onSuccess,
  onError,
}: UseAddReplicationParams) {
  const queryClient = useQueryClient();

  const { mutate: addReplicationMutation, isPending } = useMutation({
    mutationFn: addReplication,
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
