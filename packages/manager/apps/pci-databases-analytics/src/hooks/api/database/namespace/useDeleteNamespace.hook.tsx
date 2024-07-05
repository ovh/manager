import { useMutation } from '@tanstack/react-query';
import {
  DeleteNamespace,
  deleteNamespace,
} from '@/data/api/database/namespace.api';
import { CdbError } from '@/data/api/database';

export interface UseDeleteNamespace {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useDeleteNamespace({ onError, onSuccess }: UseDeleteNamespace) {
  const mutation = useMutation({
    mutationFn: (npInfo: DeleteNamespace) => {
      return deleteNamespace(npInfo);
    },
    onError,
    onSuccess,
  });

  return {
    deleteNamespace: (npInfo: DeleteNamespace) => {
      return mutation.mutate(npInfo);
    },
    ...mutation,
  };
}
