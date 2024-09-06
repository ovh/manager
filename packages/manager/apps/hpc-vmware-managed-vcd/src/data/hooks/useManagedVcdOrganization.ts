import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import {
  getVcdOrganization,
  getVcdOrganizationBackup,
} from '../api/hpc-vmware-managed-vcd';
import IVcdOrganization from '@/types/vcd-organization.interface';
import { VCD_ORGANIZATION_ROUTE } from '../api/hpc-vmware-managed-vcd.constants';
import IVcdOrganizationBackup from '@/types/vcd-organization-backup.interface';

const getVcdOrganizationQueryKey = (id: string) => [
  `get/${VCD_ORGANIZATION_ROUTE}/${id}`,
];

const getVcdOrganizationBackupQueryKey = (id: string) => [
  `${getVcdOrganizationQueryKey(id)}/backup`,
];

const useManagedVcdOrganization = (id: string) => {
  return useQuery<ApiResponse<IVcdOrganization>, ApiError>({
    queryKey: getVcdOrganizationQueryKey(id),
    queryFn: () => getVcdOrganization(id),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

export const useManagedVcdOrganizationBackup = (id: string) => {
  return useQuery<ApiResponse<IVcdOrganizationBackup>, ApiError>({
    queryKey: getVcdOrganizationBackupQueryKey(id),
    queryFn: () => getVcdOrganizationBackup(id),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

export default useManagedVcdOrganization;
