import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import IVcdOrganization from '@/types/vcd-organization.interface';
import {
  getVcdOrganization,
  getVcdOrganizationQueryKey,
} from '../api/hpc-vmware-managed-vcd';

const useManagedVcdOrganization = (id: string) => {
  return useQuery<ApiResponse<IVcdOrganization>, ApiError>({
    queryKey: getVcdOrganizationQueryKey({ id }),
    queryFn: () => getVcdOrganization({ id }),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

export default useManagedVcdOrganization;
