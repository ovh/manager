import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  updateVcdOrganizationDetails,
  UpdateVcdOrganizationDetailsParams,
} from '../api/hpc-vmware-managed-vcd';
import {
  getVcdOrganizationsQueryKey,
  getVcdOrganizationQueryKey,
  icebergListingQueryKey,
  updateVcdOrganizationDetailsMutationKey,
} from '@/utils/queryKeys';

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
        exact: true,
      });
      queryClient.invalidateQueries({
        queryKey: [...getVcdOrganizationsQueryKey(), icebergListingQueryKey],
        exact: true,
      });
      onSuccess?.();
    },
    onError: (result: ApiError) => onError?.(result),
  });

  return { updateDetails, error, isError };
};
