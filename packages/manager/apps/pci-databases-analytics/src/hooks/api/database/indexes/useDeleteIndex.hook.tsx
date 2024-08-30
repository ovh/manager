import { useMutation } from '@tanstack/react-query';
import { deleteIndex, DeleteIndex } from '@/data/api/database/indexes.api';
import { CdbError } from '@/data/api/database';

export interface UseDeleteIndex {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useDeleteIndex({ onError, onSuccess }: UseDeleteIndex) {
  const mutation = useMutation({
    mutationFn: (npInfo: DeleteIndex) => {
      return deleteIndex(npInfo);
    },
    onError,
    onSuccess,
  });

  return {
    deleteIndex: (npInfo: DeleteIndex) => {
      return mutation.mutate(npInfo);
    },
    ...mutation,
  };
}
