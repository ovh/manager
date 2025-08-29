import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CdbError } from '@/data/api/database';
import * as database from '@/types/cloud/project/database';
import { AddPattern, addPattern } from '@/data/api/database/pattern.api';

export interface UseAddPattern {
  onError: (cause: CdbError) => void;
  onSuccess: (pattern: database.opensearch.Pattern) => void;
}
export function useAddPattern({
  onError,
  onSuccess: customOnSuccess,
}: UseAddPattern) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (npInfo: AddPattern) => {
      return addPattern(npInfo);
    },
    onError,
    onSuccess: (data: database.opensearch.Pattern, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'pattern',
        ],
      });
      customOnSuccess(data);
    },
  });

  return {
    addPattern: (npInfo: AddPattern) => {
      return mutation.mutate(npInfo);
    },
    ...mutation,
  };
}
