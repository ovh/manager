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
import { getVrackListQueryKey } from '../vrack';

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
    isError: isUpdateNameError,
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
      queryClient.invalidateQueries({
        queryKey: getVrackListQueryKey,
      });
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
    isErrorVisible,
    error: updateNameError,
    hideError: () => setIsErrorVisible(false),
  };
};
