import { useMutation, useQuery } from '@tanstack/react-query';
import {
  addSshKey,
  filterSshKeys,
  getAllSshKeys,
  getSshKey,
  paginateResults,
  removeSshKey,
  SshKeysOptions,
} from '@/data/ssh';
import queryClient from '@/queryClient';
import { SshKey } from '@/interface';

type RemoveSshProps = {
  projectId: string;
  sshId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};
type AddSshProps = {
  projectId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useAllSshKeys = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId, 'sshkeys'],
    queryFn: () => getAllSshKeys(projectId),
    retry: false,
    ...{
      //    keepPreviousData: true,
    },
  });
};

export const useSshKey = (projectId: string, sshId: string) => {
  return useQuery({
    queryKey: ['project', projectId, 'sshkey', sshId],
    queryFn: () => getSshKey(projectId, sshId),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

export const useSshKeys = (
  projectId: string,
  { pagination, sorting }: SshKeysOptions,
) => {
  // retrieve All ssh keys from API
  const {
    data: sshkeys,
    error: allSshKeysError,
    isLoading: allSshKeysLoading,
  } = useAllSshKeys(projectId);

  // filtering ssh keys
  const { data: filteredsshKeys } = useQuery({
    queryKey: [
      'project',
      projectId,
      'sshkeys',
      sshkeys?.map(({ id }) => id).join('-'),
      sorting,
    ],
    queryFn: () => filterSshKeys(sshkeys || [], sorting),
    enabled: !!sshkeys,
  });

  // paginate results
  const { isLoading, error, data } = useQuery({
    queryKey: [
      'project',
      projectId,
      'sshkeys',
      sshkeys?.map(({ id }) => id).join('-'),
      sorting,
      pagination,
    ],
    queryFn: () => paginateResults(filteredsshKeys || [], pagination),
    enabled: !!filteredsshKeys,
  });

  return {
    isLoading: allSshKeysLoading || isLoading,
    error: allSshKeysError || error,
    data,
  };
};

export function useRemoveSsh({
  projectId,
  sshId,
  onError,
  onSuccess,
}: RemoveSshProps) {
  const mutation = useMutation({
    mutationFn: () => {
      return removeSshKey(`${projectId}`, `${sshId}`);
    },
    onError,
    onSuccess: async () => {
      queryClient.setQueryData(
        ['project', projectId, 'sshkeys'],
        (old: SshKey[]) => [...old.filter(({ id }) => id !== sshId)],
      );

      queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'sshkeys'],
        // refetchType: 'all',
      });
      onSuccess();
    },
  });

  return {
    remove: () => {
      return mutation.mutate();
    },
    ...mutation,
  };
}

export function useAddSsh({ projectId, onError, onSuccess }: AddSshProps) {
  const mutation = useMutation({
    mutationFn: ({ name, publicKey }: { name: string; publicKey: string }) => {
      return addSshKey(`${projectId}`, { name, publicKey });
    },
    onError,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'sshkeys'],
        // refetchType: 'all',
      });
      onSuccess();
    },
  });

  return {
    add: ({ name, publicKey }: { name: string; publicKey: string }) => {
      return mutation.mutate({ name, publicKey });
    },
    ...mutation,
  };
}
