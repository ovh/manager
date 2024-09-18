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
import { VCD_ORGANIZATION_ROUTE } from '../api/hpc-vmware-managed-vcd.constants';
import IVcdOrganizationBackup from '@/types/vcd-organization-backup.interface';

interface IUseManagedVcdOrganization
  extends Pick<UseQueryOptions, 'refetchOnWindowFocus' | 'refetchInterval'> {
  id: string;
}

const getVcdOrganizationQueryKey = (id: string) => [
  `get${VCD_ORGANIZATION_ROUTE}/${id}`,
];

const getVcdOrganizationBackupQueryKey = (id: string) => [
  `${getVcdOrganizationQueryKey(id)}/backup`,
];

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
