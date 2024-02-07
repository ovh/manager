import { useQuery } from '@tanstack/react-query';
import {
  filterSshKeys,
  getAllSshKeys,
  paginateResults,
  SshKeysOptions,
} from '@/data/ssh';

// const VOUCHERS_POLLING_INTERVAL = 5000;

export const useAllSshKeys = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId, 'sshkeys'],
    queryFn: () => getAllSshKeys(projectId),
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
    queryKey: ['project', projectId, 'sshkeys', sorting],
    queryFn: () => filterSshKeys(sshkeys || [], sorting),
    enabled: !!sshkeys,
  });

  // paginate results
  const { isLoading, error, data } = useQuery({
    queryKey: ['project', projectId, 'sshkeys', sorting, pagination],
    queryFn: () => paginateResults(filteredsshKeys || [], pagination),
    enabled: !!filteredsshKeys,
  });

  return {
    isLoading: allSshKeysLoading || isLoading,
    error: allSshKeysError || error,
    data,
  };
};
