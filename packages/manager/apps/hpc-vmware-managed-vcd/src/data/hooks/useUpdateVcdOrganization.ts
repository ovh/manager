import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  updateVcdOrganizationDetails,
  UpdateVcdOrganizationDetailsParams,
} from '../api/hpc-vmware-managed-vcd';
import { VCD_ORGANIZATION_ROUTE } from '../api/hpc-vmware-managed-vcd.constants';

const updateVcdOrganizationDetailsQueryKey = (id: string) => [
  `put${VCD_ORGANIZATION_ROUTE}/${id}`,
];

const getVcdProjectListQueryKey = [`get${VCD_ORGANIZATION_ROUTE}`];

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
