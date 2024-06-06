import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import {
  updateVrackServicesName,
  updateVrackServicesNameQueryKey,
} from './put';
import {
  getVrackServicesServiceId,
  getVrackServicesServiceIdQueryKey,
} from './get';
import { getVrackServicesResourceListQueryKey } from '../vrack-services';

export type UpdateVrackServicesNameMutationParams = {
  /** vrackServices service id */
  vrackServices: string;
  /** vrackServices service new display name */
  displayName: string;
};

/**
 * Get the function to mutate a vRack Services
 */
export const useUpdateVrackServicesName = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (result: ApiError) => void;
}) => {
  const [isErrorVisible, setIsErrorVisible] = React.useState(false);
  const queryClient = useQueryClient();

  const {
    mutate: updateVSName,
    isPending,
    error: updateNameError,
  } = useMutation({
    mutationKey: updateVrackServicesNameQueryKey(),
    mutationFn: async ({
      vrackServices,
      displayName,
    }: UpdateVrackServicesNameMutationParams) => {
      const { data: servicesId } = await queryClient.fetchQuery<
        ApiResponse<number[]>
      >({
        queryKey: getVrackServicesServiceIdQueryKey({ vrackServices }),
        queryFn: () => getVrackServicesServiceId({ vrackServices }),
      });
      return updateVrackServicesName({ serviceId: servicesId[0], displayName });
    },
    onSuccess: () => {
      setTimeout(
        () =>
          queryClient.invalidateQueries({
            queryKey: getVrackServicesResourceListQueryKey,
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
    updateVSName,
    isPending,
    isErrorVisible: updateNameError && isErrorVisible,
    error: updateNameError,
    hideError: () => setIsErrorVisible(false),
  };
};
