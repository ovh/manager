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

export const useManagedVcdOrganizationBackup = (id: string) => {
  return useQuery<ApiResponse<IVcdOrganizationBackup>, ApiError>({
    queryKey: getVcdOrganizationBackupQueryKey(id),
    queryFn: () => getVcdOrganizationBackup(id),
    retry: false,
    placeholderData: keepPreviousData,
  });
};

export default useManagedVcdOrganization;
