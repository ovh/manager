import { MutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import { getResourceServiceId, getResourceServiceIdQueryKey, updateServiceName } from '../api';

export const updateServiceNameMutationKey = ['put/services/displayName'];

export type UpdateServiceNameMutationParams = {
  /** Resource name or id */
  resourceName: string;
  /** Resource new display name */
  displayName: string;
};

export type UseUpdateServiceDisplayNameParams = MutationOptions<
  ApiResponse<{ message: string }>,
  ApiError,
  UpdateServiceNameMutationParams
>;

export const useUpdateServiceDisplayName = ({
  mutationKey = updateServiceNameMutationKey,
  ...options
}: UseUpdateServiceDisplayNameParams) => {
  const queryClient = useQueryClient();
  const { mutate: updateDisplayName, ...mutation } = useMutation({
    mutationKey,
    mutationFn: async ({ resourceName, displayName }) => {
      const { data: servicesId } = await queryClient.fetchQuery<ApiResponse<number[]>>({
        queryKey: getResourceServiceIdQueryKey({ resourceName }),
        queryFn: () => getResourceServiceId({ resourceName }),
      });
      return updateServiceName({ serviceId: servicesId[0] ?? 0, displayName });
    },
    ...options,
  });
  return {
    updateDisplayName,
    ...mutation,
  };
};
