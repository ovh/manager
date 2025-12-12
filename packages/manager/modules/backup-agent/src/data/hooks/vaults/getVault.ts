import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';

import { BACKUP_VAULTS_LIST_ROUTE } from '@/data/api/vaults/vault.requests';
import { VaultResource } from '@/types/Vault.type';

export const BACKUP_VAULTS_LIST_QUERY_KEY = ['backup', 'vaults'];

export const useBackupVaultsList = (
  {
    pageSize,
  }: {
    pageSize: number;
  } = { pageSize: 9999 },
) =>
  useResourcesIcebergV2<VaultResource>({
    route: BACKUP_VAULTS_LIST_ROUTE,
    queryKey: BACKUP_VAULTS_LIST_QUERY_KEY,
    pageSize,
  });
