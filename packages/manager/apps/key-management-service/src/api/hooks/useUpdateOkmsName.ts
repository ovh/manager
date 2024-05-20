import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { updateOkmsName, updateOkmsNameQueryKey } from '../services/put';
import { getOkmsServiceId, getOkmsServiceIdQueryKey } from '../services/get';
import { getOkmsServicesResourceListQueryKey } from '../GET/apiv2/services';

export type UpdateOkmsNameMutationParams = {
  /** Okms service id */
  okms: string;
  /** Okms service new display name */
  displayName: string;
};

/**
 * Get the function to mutate a okms Services
 */
export const useUpdateOkmsName = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (result: ApiError) => void;
}) => {
  const [isErrorVisible, setIsErrorVisible] = React.useState(false);
  const queryClient = useQueryClient();

  const {
    mutate: updateKmsName,
    isPending,
    error: updateNameError,
  } = useMutation({
    mutationKey: updateOkmsNameQueryKey(),
    mutationFn: async ({ okms, displayName }: UpdateOkmsNameMutationParams) => {
      const { data: servicesId } = await queryClient.fetchQuery<
        ApiResponse<number[]>
      >({
        queryKey: getOkmsServiceIdQueryKey({ okms }),
        queryFn: () => getOkmsServiceId({ okms }),
      });
      return updateOkmsName({ serviceId: servicesId[0], displayName });
    },
    onSuccess: () => {
      setTimeout(
        () =>
          queryClient.invalidateQueries({
            queryKey: getOkmsServicesResourceListQueryKey,
          }),
        1000,
      );
      onSuccess?.();
    },
    onError: (result: ApiError) => {
      setIsErrorVisible(true);
      onError?.(result);
    },
  });

  return {
    updateKmsName,
    isPending,
    isErrorVisible: updateNameError && isErrorVisible,
    error: updateNameError,
    hideError: () => setIsErrorVisible(false),
  };
};
