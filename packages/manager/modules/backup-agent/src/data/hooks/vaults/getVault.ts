import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';

import { VaultResource } from '@/types/Vault.type';
import { getVaultsRoute } from '@/utils/apiRoutes';

import { useBackupServicesId } from '../backup/useBackupServicesId';

export const BACKUP_VAULTS_LIST_QUERY_KEY = ['backup', 'vaults'];

export const useBackupVaultsList = (
  {
    pageSize,
  }: {
    pageSize: number;
  } = { pageSize: 9999 },
) => {
  const { data: backupServicesId } = useBackupServicesId();

  return useResourcesIcebergV2<VaultResource>({
    route: getVaultsRoute(backupServicesId!),
    queryKey: BACKUP_VAULTS_LIST_QUERY_KEY,
    pageSize,
    enabled: !!backupServicesId,
  });
};
