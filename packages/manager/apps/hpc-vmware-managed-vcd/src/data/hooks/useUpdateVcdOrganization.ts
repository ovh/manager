import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  getVcdProjectListQueryKey,
  updateVcdOrganizationDetails,
  UpdateVcdOrganizationDetailsParams,
} from '../api/hpc-vmware-managed-vcd';

const updateVcdOrganizationDetailsQueryKey = (id: string) => [
  `put/vmwareCloudDirector/organization/${id}`,
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
    mutationKey: updateVcdOrganizationDetailsQueryKey(id),
    mutationFn: ({ details }: UpdateVcdOrganizationDetailsParams) =>
      updateVcdOrganizationDetails({ id, details }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getVcdProjectListQueryKey,
      });
      onSuccess?.();
    },
    onError: (result: ApiError) => onError?.(result),
  });

  return { updateDetails, error, isError };
};
