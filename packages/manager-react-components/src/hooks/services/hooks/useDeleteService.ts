/**
 * @deprecated This file is deprecated. Do not use any of its exports.
 * @deprecated file will be removed in MRC v3, all code will be move in @ovh-ux/manager-module-common-api' or already moved
 */
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getResourceServiceId,
  getResourceServiceIdQueryKey,
  deleteService,
} from '../api';

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type DeleteServiceMutationParams = {
  resourceName: string;
};

/**
 * @deprecated The constant is deprecated and will be removed in MRC V3.
 */
export const deleteServiceMutationKey = ['delete-service'];

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type UseDeleteServiceParams = {
  onSuccess?: () => void;
  onError?: (result: ApiError) => void;
  mutationKey?: string[];
};

/**
 * @deprecated This hook is deprecated and will be removed in MRC V3.
 */
export const useDeleteService = ({
  onSuccess,
  onError,
  mutationKey = deleteServiceMutationKey,
}: UseDeleteServiceParams) => {
  const queryClient = useQueryClient();
  const { mutate: terminateService, ...mutation } = useMutation({
    mutationKey,
    mutationFn: async ({ resourceName }: DeleteServiceMutationParams) => {
      const { data } = await queryClient.fetchQuery<
        ApiResponse<number[]>,
        ApiError
      >({
        queryKey: getResourceServiceIdQueryKey({ resourceName }),
        queryFn: () => getResourceServiceId({ resourceName }),
      });
      return deleteService({ serviceId: data[0] });
    },
    onSuccess,
    onError,
  });

  return {
    terminateService,
    ...mutation,
  };
};
