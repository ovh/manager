import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteIndex, DeleteIndex } from '@/data/api/database/indexes.api';
import { CdbError } from '@/data/api/database';

export interface UseDeleteIndex {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useDeleteIndex({
  onError,
  onSuccess: customOnSuccess,
}: UseDeleteIndex) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (npInfo: DeleteIndex) => {
      return deleteIndex(npInfo);
    },
    onError,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'index',
        ],
      });
      customOnSuccess();
    },
  });

  return {
    deleteIndex: (npInfo: DeleteIndex) => {
      return mutation.mutate(npInfo);
    },
    ...mutation,
  };
}
