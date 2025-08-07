/**
 * @deprecated This file is deprecated. Do not use any of its exports.
 * @deprecated file will be removed in MRC v3, all code will be move in @ovh-ux/manager-module-common-api' or already moved
 */
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {
  updateServiceName,
  getResourceServiceId,
  getResourceServiceIdQueryKey,
} from '../api';

/**
 * @deprecated The constant is deprecated and will be removed in MRC V3.
 */
export const updateServiceNameMutationKey = ['put/services/displayName'];

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type UpdateServiceNameMutationParams = {
  /** Resource name or id */
  resourceName: string;
  /** Resource new display name */
  displayName?: string;
};

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type UseUpdateServiceDisplayNameParams = {
  onSuccess?: () => void;
  onError?: (result: ApiError) => void;
  mutationKey?: string[];
};

/**
 * @deprecated This hook is deprecated and will be removed in MRC V3.
 */
export const useUpdateServiceDisplayName = ({
  onSuccess,
  onError,
  mutationKey = updateServiceNameMutationKey,
}: UseUpdateServiceDisplayNameParams) => {
  const queryClient = useQueryClient();
  const { mutate: updateDisplayName, ...mutation } = useMutation({
    mutationKey,
    mutationFn: async ({
      resourceName,
      displayName,
    }: UpdateServiceNameMutationParams) => {
      const { data: servicesId } = await queryClient.fetchQuery<
        ApiResponse<number[]>
      >({
        queryKey: getResourceServiceIdQueryKey({ resourceName }),
        queryFn: () => getResourceServiceId({ resourceName }),
      });
      return updateServiceName({ serviceId: servicesId[0], displayName });
    },
    onSuccess,
    onError,
  });
  return {
    updateDisplayName,
    ...mutation,
  };
};
