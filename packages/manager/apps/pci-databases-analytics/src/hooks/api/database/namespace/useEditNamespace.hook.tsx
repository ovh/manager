import { useMutation } from '@tanstack/react-query';
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
export function useEditNamespace({ onError, onSuccess }: UsEditNamespace) {
  const mutation = useMutation({
    mutationFn: (npInfo: EditNamespace) => {
      return editNamespace(npInfo);
    },
    onError,
    onSuccess,
  });

  return {
    editNamespace: (npInfo: EditNamespace) => {
      return mutation.mutate(npInfo);
    },
    ...mutation,
  };
}
