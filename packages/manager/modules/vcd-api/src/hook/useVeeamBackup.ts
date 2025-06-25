import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import { VeeamBackup } from '../types';
import {
  getVmwareCloudDirectorBackup,
  activateVmwareCloudDirectorBackupOfferGold,
} from '../api';
import { getVeeamBackupQueryKey, veeamBackupListQueryKey } from '../utils';

export const getRegionNameFromAzName = (azName = '') => azName?.split('-a')[0];

export const useVeeamBackupList = ({ pageSize }: { pageSize?: number }) =>
  useResourcesIcebergV2<VeeamBackup>({
    route: '/vmwareCloudDirector/backup',
    queryKey: veeamBackupListQueryKey,
    pageSize,
  });

export const useVeeamBackup = (id?: string) =>
  useQuery<ApiResponse<VeeamBackup>, ApiError>({
    queryKey: getVeeamBackupQueryKey(id),
    queryFn: () => getVmwareCloudDirectorBackup(id),
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!id,
  });

export const getVeeamBackupDisplayName = (backup?: VeeamBackup) =>
  backup?.iam?.displayName || backup?.id;

export const useActivateVmwareCloudDirectorBackupOfferGold = ({
  backupId,
  onSuccess,
  onError,
}: {
  backupId: string;
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync, ...mutation } = useMutation({
    mutationFn: (quotaInTB: number) =>
      activateVmwareCloudDirectorBackupOfferGold(backupId, quotaInTB),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getVeeamBackupQueryKey(backupId),
      });
      onSuccess?.();
    },
    onError: (error: ApiError) => onError?.(error),
  });

  const activateGoldOffer = (quotaInTB?: number) => mutateAsync(quotaInTB);

  return { activateGoldOffer, ...mutation };
};
