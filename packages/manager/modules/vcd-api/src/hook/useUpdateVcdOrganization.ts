import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  updateVcdOrganizationDetails,
  UpdateVcdOrganizationDetailsParams,
} from '../api';
import {
  vcdOrganizationListQueryKey,
  getVcdOrganizationQueryKey,
  icebergListingQueryKey,
  updateVcdOrganizationDetailsMutationKey,
} from '../utils';

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
        queryKey: [...vcdOrganizationListQueryKey, icebergListingQueryKey],
        exact: true,
      });
      onSuccess?.();
    },
    onError: (result: ApiError) => onError?.(result),
  });

  return { updateDetails, error, isError };
};
