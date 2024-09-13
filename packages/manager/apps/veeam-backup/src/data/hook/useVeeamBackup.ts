import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { VeeamBackupWithIam } from '../vcd.type';
import { getVmwareCloudDirectorBackup } from '../api';

export const veeamBackupListQueryKey = ['/vmwareCloudDirector/backup'];

export const useVeeamBackupList = ({ pageSize }: { pageSize?: number }) =>
  useResourcesIcebergV2<VeeamBackupWithIam>({
    route: '/vmwareCloudDirector/backup',
    queryKey: veeamBackupListQueryKey,
    pageSize,
  });

export const veeamBackupQueryKey = (id: string) => [
  `/vmwareCloudDirector/backup/${id}`,
];

export const useVeeamBackup = (id?: string) =>
  useQuery<ApiResponse<VeeamBackupWithIam>, ApiError>({
    queryKey: veeamBackupQueryKey(id),
    queryFn: () => getVmwareCloudDirectorBackup(id),
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!id,
  });

export const getVeeamBackupDisplayName = (backup?: VeeamBackupWithIam) =>
  backup?.iam?.displayName || backup?.id;
