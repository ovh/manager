import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DeleteNamespace,
  deleteNamespace,
} from '@/data/api/database/namespace.api';
import { CdbError } from '@/data/api/database';

export interface UseDeleteNamespace {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useDeleteNamespace({
  onError,
  onSuccess: customOnSuccess,
}: UseDeleteNamespace) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (npInfo: DeleteNamespace) => {
      return deleteNamespace(npInfo);
    },
    onError,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'namespace',
        ],
      });
      customOnSuccess();
    },
  });

  return {
    deleteNamespace: (npInfo: DeleteNamespace) => {
      return mutation.mutate(npInfo);
    },
    ...mutation,
  };
}
