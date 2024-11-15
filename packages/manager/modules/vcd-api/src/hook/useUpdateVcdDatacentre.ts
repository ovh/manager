import { ApiError } from '@ovh-ux/manager-core-api';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { updateVdcDetails, UpdateVdcDetailsParams } from '../api';
import {
  getVcdDatacentresQueryKey,
  updateVdcDetailsMutationKey,
} from '../utils';

export const useUpdateVdcDetails = ({
  id,
  vdcId,
  onSuccess,
  onError,
}: {
  id: string;
  vdcId: string;
  onSuccess?: () => void;
  onError?: (result: ApiError) => void;
}) => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateDetails, error, isError } = useMutation({
    mutationKey: updateVdcDetailsMutationKey(vdcId),
    mutationFn: ({ details }: UpdateVdcDetailsParams) =>
      updateVdcDetails({ id, vdcId, details }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getVcdDatacentresQueryKey(id),
      });
      onSuccess?.();
    },
    onError: (result: ApiError) => onError?.(result),
  });

  return { updateDetails, error, isError };
};
