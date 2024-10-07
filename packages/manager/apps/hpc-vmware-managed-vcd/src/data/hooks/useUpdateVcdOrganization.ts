import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  updateVcdOrganizationDetails,
  UpdateVcdOrganizationDetailsParams,
} from '../api/hpc-vmware-managed-vcd';
import { VCD_ORGANIZATION_ROUTE } from '../api/hpc-vmware-managed-vcd.constants';
import { getVcdOrganizationQueryKey } from './useManagedVcdOrganization';
import { icebergListingQueryKey } from '@/components/datagrid/container/DatagridContainer.constants';
import { organizationListingContainerId } from '@/pages/listing/organizations/Organizations.constants';

const updateVcdOrganizationDetailsMutationKey = (id: string) => [
  `put${VCD_ORGANIZATION_ROUTE}/${id}`,
];

export const useUpdateVcdOrganizationDetails = ({
  id,
  onSuccess,
  onError,
}: {
  id: string;
  onSuccess?: () => void;
  onError?: (result: ApiError) => void;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateDetails, error, isError } = useMutation({
    mutationKey: updateVcdOrganizationDetailsMutationKey(id),
    mutationFn: ({ details }: UpdateVcdOrganizationDetailsParams) =>
      updateVcdOrganizationDetails({ id, details }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getVcdOrganizationQueryKey(id),
      });
      queryClient.invalidateQueries({
        queryKey: [organizationListingContainerId, icebergListingQueryKey],
        exact: true,
      });
      onSuccess?.();
    },
    onError: (result: ApiError) => onError?.(result),
  });

  return { updateDetails, error, isError };
};
