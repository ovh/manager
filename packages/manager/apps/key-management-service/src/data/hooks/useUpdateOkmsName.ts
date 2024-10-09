import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import {
  getOkmsResourceQueryKey,
  getOkmsServicesResourceListQueryKey,
} from '../api/okms';
import {
  updateOkmsNameQueryKey,
  getOkmsServiceIdQueryKey,
  getOkmsServiceId,
  updateOkmsName,
} from '../api/okmsService';
import { getKMSServiceInfosQueryKey } from './useKMSServiceInfos';

export type UpdateOkmsParams = {
  okmsId: string;
  onSuccess: () => void;
  onError: (result: ApiError) => void;
};
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
  okmsId,
  onSuccess,
  onError,
}: UpdateOkmsParams) => {
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
        queryKey: getOkmsServiceIdQueryKey(okms),
        queryFn: () => getOkmsServiceId(okms),
      });
      return updateOkmsName({ serviceId: servicesId[0], displayName });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getOkmsServicesResourceListQueryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getKMSServiceInfosQueryKey(okmsId),
      });
      await queryClient.invalidateQueries({
        queryKey: getOkmsResourceQueryKey(okmsId),
      });
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
