import {
  QueryObserverOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import { database } from '@/models/database';
import {
  AddNamespaceProps,
  DeleteNamespaceProps,
  EditNamespaceProps,
  addNamespace,
  deleteNamespace,
  editNamespace,
  getNamespaces,
} from '@/api/databases/namespaces';
import { CdbError } from '@/api/databases';

export function useGetNamespaces(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'namespace'];
  return useQuery({
    queryKey,
    queryFn: () => getNamespaces({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.m3db.Namespace[], Error>;
}

export interface MutateNamespaceProps {
  onError: (cause: CdbError) => void;
  onSuccess: (namespace: database.m3db.Namespace) => void;
}

export function useAddNamespace({ onError, onSuccess }: MutateNamespaceProps) {
  const mutation = useMutation({
    mutationFn: (npInfo: AddNamespaceProps) => {
      return addNamespace(npInfo);
    },
    onError,
    onSuccess,
  });

  return {
    addNamespace: (npInfo: AddNamespaceProps) => {
      return mutation.mutate(npInfo);
    },
    ...mutation,
  };
}

export function useEditNamespace({ onError, onSuccess }: MutateNamespaceProps) {
  const mutation = useMutation({
    mutationFn: (npInfo: EditNamespaceProps) => {
      return editNamespace(npInfo);
    },
    onError,
    onSuccess,
  });

  return {
    editNamespace: (npInfo: EditNamespaceProps) => {
      return mutation.mutate(npInfo);
    },
    ...mutation,
  };
}

interface UseDeleteNamespaceProps {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}

export function useDeleteNamespace({
  onError,
  onSuccess,
}: UseDeleteNamespaceProps) {
  const mutation = useMutation({
    mutationFn: (npInfo: DeleteNamespaceProps) => {
      return deleteNamespace(npInfo);
    },
    onError,
    onSuccess,
  });

  return {
    deleteNamespace: (npInfo: DeleteNamespaceProps) => {
      return mutation.mutate(npInfo);
    },
    ...mutation,
  };
}
