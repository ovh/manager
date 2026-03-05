import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DeletePattern, deletePattern } from '@/data/api/database/pattern.api';
import { CdbError } from '@/data/api/database';

export interface UseDeletePattern {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useDeletePattern({
  onError,
  onSuccess: customOnSuccess,
}: UseDeletePattern) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (npInfo: DeletePattern) => {
      return deletePattern(npInfo);
    },
    onError,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'pattern',
        ],
      });
      customOnSuccess();
    },
  });

  return {
    deletePattern: (npInfo: DeletePattern) => {
      return mutation.mutate(npInfo);
    },
    ...mutation,
  };
}
