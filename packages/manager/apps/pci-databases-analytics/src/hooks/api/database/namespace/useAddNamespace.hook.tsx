import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CdbError } from '@/data/api/database';
import * as database from '@/types/cloud/project/database';
import { AddNamespace, addNamespace } from '@/data/api/database/namespace.api';

export interface UseAddNamespace {
  onError: (cause: CdbError) => void;
  onSuccess: (namespace: database.m3db.Namespace) => void;
}
export function useAddNamespace({
  onError,
  onSuccess: customOnSuccess,
}: UseAddNamespace) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (npInfo: AddNamespace) => {
      return addNamespace(npInfo);
    },
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'namespace',
        ],
      });
      customOnSuccess(data);
    },
  });

  return {
    addNamespace: (npInfo: AddNamespace) => {
      return mutation.mutate(npInfo);
    },
    ...mutation,
  };
}
