import { mockVaults } from '@/mocks/vault/vaults';

// const BACKUP_VAULTS_LIST_ROUTE = '/backup/tenant/vault';
export const BACKUP_VAULTS_LIST_QUERY_KEY = ['backup', 'vaults', 'list'];

export const useBackupVaultsList = (
  {
    // pageSize,
  }: {
    pageSize: number;
  } = { pageSize: 9999 },
) => ({ flattenData: mockVaults, isLoading: false });
// useResourcesIcebergV2<VaultResource>({
//   route: BACKUP_VAULTS_LIST_ROUTE,
//   queryKey: BACKUP_VAULTS_LIST_QUERY_KEY,
//   pageSize,
// });
