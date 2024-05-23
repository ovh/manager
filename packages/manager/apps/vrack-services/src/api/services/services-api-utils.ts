import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { updateServiceName, updateServiceNameQueryKey } from './put';
import {
  getVrackServicesServiceId,
  getVrackServicesServiceIdQueryKey,
} from './get';
import { getVrackServicesResourceListQueryKey } from '../vrack-services';
import { deleteVrackServices, deleteVrackServicesQueryKey } from './post';

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
  invalidateTimeoutOnSuccess = 1000,
}: {
  onSuccess?: () => void;
  onError?: (result: ApiError) => void;
  invalidateTimeoutOnSuccess?: number;
} = {}) => {
  const [isErrorVisible, setIsErrorVisible] = React.useState(false);
  const queryClient = useQueryClient();

  const {
    mutate: updateVSName,
    isPending,
    error: updateNameError,
  } = useMutation({
    mutationKey: updateServiceNameQueryKey,
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
      return updateServiceName({ serviceId: servicesId[0], displayName });
    },
    onSuccess: () => {
      setTimeout(
        () =>
          queryClient.invalidateQueries({
            queryKey: getVrackServicesResourceListQueryKey,
          }),
        invalidateTimeoutOnSuccess,
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

export const useDeleteVrackServices = ({
  vrackServices,
  onSuccess,
  onError,
  invalidateTimeoutOnSuccess = 5000,
}: {
  vrackServices: string;
  onSuccess?: () => void;
  onError?: (result: ApiError) => void;
  invalidateTimeoutOnSuccess?: number;
}) => {
  const queryClient = useQueryClient();

  const { data: servicesId, isError, error } = useQuery<
    ApiResponse<number[]>,
    ApiError
  >({
    queryKey: getVrackServicesServiceIdQueryKey({ vrackServices }),
    queryFn: () => getVrackServicesServiceId({ vrackServices }),
    enabled: !!vrackServices,
  });

  const {
    mutate: deleteVs,
    isError: isTerminateError,
    error: terminateError,
  } = useMutation({
    mutationFn: () =>
      deleteVrackServices({
        serviceId: servicesId?.data[0],
      }),
    mutationKey: deleteVrackServicesQueryKey(vrackServices),
    onSuccess: () => {
      onSuccess?.();
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: getVrackServicesResourceListQueryKey,
        });
      }, invalidateTimeoutOnSuccess);
    },
    onError,
  });

  return {
    deleteVs,
    isErrorVisible: isError || isTerminateError,
    error: error || terminateError,
  };
};
