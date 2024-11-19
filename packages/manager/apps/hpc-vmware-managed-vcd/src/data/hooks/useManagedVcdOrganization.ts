import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  keepPreviousData,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import {
  getVcdOrganization,
  getVcdOrganizationBackup,
} from '../api/hpc-vmware-managed-vcd';
import IVcdOrganization from '@/types/vcd-organization.interface';
import IVcdOrganizationBackup from '@/types/vcd-organization-backup.interface';
import {
  getVcdOrganizationQueryKey,
  getVcdOrganizationBackupQueryKey,
} from '@/utils/queryKeys';
import { getBackupIdFromOrganization } from '@/utils/veeamBackupId';

interface IUseManagedVcdOrganization
  extends Pick<UseQueryOptions, 'refetchOnWindowFocus' | 'refetchInterval'> {
  id: string;
}

const useManagedVcdOrganization = ({
  id,
  refetchInterval,
  refetchOnWindowFocus,
}: IUseManagedVcdOrganization) => {
  return useQuery<ApiResponse<IVcdOrganization>, ApiError>({
    queryKey: getVcdOrganizationQueryKey(id),
    queryFn: () => getVcdOrganization(id),
    retry: false,
    refetchInterval,
    refetchOnWindowFocus,
    placeholderData: keepPreviousData,
  });
};

export const useManagedVcdOrganizationBackup = (
  vcdOrganization: IVcdOrganization,
) => {
  return useQuery<ApiResponse<IVcdOrganizationBackup>, ApiError>({
    queryKey: getVcdOrganizationBackupQueryKey(vcdOrganization.id),
    queryFn: () =>
      getVcdOrganizationBackup(getBackupIdFromOrganization(vcdOrganization)),
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export default useManagedVcdOrganization;
