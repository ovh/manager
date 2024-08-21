import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  getVcdProjectListQueryKey,
  updateVcdOrganizationDetails,
  UpdateVcdOrganizationDetailsParams,
  updateVcdOrganizationDetailsQueryKey,
} from '../api/hpc-vmware-managed-vcd';

export const useUpdateVcdOrganizationDetails = ({
  id,
  onSuccess,
  onError,
}: {
  id: string;
  onSuccess?: () => void;
  onError?: (err: ApiError) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: updateVcdOrganizationDetailsQueryKey(id),
    mutationFn: ({ details }: UpdateVcdOrganizationDetailsParams) =>
      updateVcdOrganizationDetails({ id, details }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getVcdProjectListQueryKey,
      });
      onSuccess?.();
    },
    onError: (err: ApiError) => onError?.(err),
  });
};
