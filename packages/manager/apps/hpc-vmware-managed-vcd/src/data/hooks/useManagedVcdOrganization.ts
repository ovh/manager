import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import { getVcdOrganization } from '../api/hpc-vmware-managed-vcd';
import IVcdOrganization from '@/types/vcd-organization.interface';

const getVcdOrganizationQueryKey = (id: string) => [
  `get/vmwareCloudDirector/organization/${id}`,
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

export default useManagedVcdOrganization;
