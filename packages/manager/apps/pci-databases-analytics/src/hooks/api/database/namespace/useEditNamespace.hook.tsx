import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  EditNamespace,
  editNamespace,
} from '@/data/api/database/namespace.api';
import { CdbError } from '@/data/api/database';
import * as database from '@/types/cloud/project/database';

export interface UsEditNamespace {
  onError: (cause: CdbError) => void;
  onSuccess: (namespace: database.m3db.Namespace) => void;
}
export function useEditNamespace({
  onError,
  onSuccess: customOnSuccess,
}: UsEditNamespace) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (npInfo: EditNamespace) => {
      return editNamespace(npInfo);
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
    editNamespace: (npInfo: EditNamespace) => {
      return mutation.mutate(npInfo);
    },
    ...mutation,
  };
}
