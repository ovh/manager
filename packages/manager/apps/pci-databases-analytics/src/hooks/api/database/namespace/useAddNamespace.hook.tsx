import { useMutation } from '@tanstack/react-query';
import { CdbError } from '@/data/api/database';
import * as database from '@/types/cloud/project/database';
import { AddNamespace, addNamespace } from '@/data/api/database/namespace.api';

export interface UseAddNamespace {
  onError: (cause: CdbError) => void;
  onSuccess: (namespace: database.m3db.Namespace) => void;
}
export function useAddNamespace({ onError, onSuccess }: UseAddNamespace) {
  const mutation = useMutation({
    mutationFn: (npInfo: AddNamespace) => {
      return addNamespace(npInfo);
    },
    onError,
    onSuccess,
  });

  return {
    addNamespace: (npInfo: AddNamespace) => {
      return mutation.mutate(npInfo);
    },
    ...mutation,
  };
}
