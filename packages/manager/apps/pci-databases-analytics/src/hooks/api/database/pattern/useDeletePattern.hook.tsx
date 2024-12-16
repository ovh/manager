import { useMutation } from '@tanstack/react-query';
import { DeletePattern, deletePattern } from '@/data/api/database/pattern.api';
import { CdbError } from '@/data/api/database';

export interface UseDeletePattern {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useDeletePattern({ onError, onSuccess }: UseDeletePattern) {
  const mutation = useMutation({
    mutationFn: (npInfo: DeletePattern) => {
      return deletePattern(npInfo);
    },
    onError,
    onSuccess,
  });

  return {
    deletePattern: (npInfo: DeletePattern) => {
      return mutation.mutate(npInfo);
    },
    ...mutation,
  };
}
