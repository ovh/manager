import { queryOptions, useQuery } from '@tanstack/react-query';

import { getVaults } from '@/data/api/vaults/vault.requests';

import { useGetBackupServicesId } from '../backup/useBackupServicesId';

export const BACKUP_VAULTS_LIST_QUERY_KEY = ['backup', 'vaults'];

export const useBackupVaultsListOptions = () => {
  const getBackupServiceId = useGetBackupServicesId();
  return queryOptions({
    queryKey: BACKUP_VAULTS_LIST_QUERY_KEY,
    queryFn: async () => {
      const backupServicesId = await getBackupServiceId();

      return getVaults(backupServicesId!);
    },
  });
};

export const useBackupVaultsList = () => useQuery(useBackupVaultsListOptions());
