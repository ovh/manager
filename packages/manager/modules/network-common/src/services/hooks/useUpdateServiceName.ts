import {
  MutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import {
  getResourceServiceId,
  getResourceServiceIdQueryKey,
  updateService,
} from '../api';

export const updateServiceNameMutationKey = ['put/services/displayName'];

export type UpdateServiceNameMutationParams = {
  /** Resource name or id */
  resourceName: string;
  /** Resource new display name */
  displayName: string;
};

export type UseUpdateServiceDisplayNameParams = MutationOptions<
  ApiResponse<{ message: string }>,
  ApiError | Error,
  UpdateServiceNameMutationParams
>;

/**
 * @deprecated Use useUpdateService instead, which allows to update not only the display name but also the service renewal and termination policy.
 */
export const useUpdateServiceDisplayName = (options: UseUpdateServiceDisplayNameParams) => {
  const queryClient = useQueryClient();
  const { mutate: updateDisplayName, ...mutation } = useMutation({
    mutationFn: async ({ resourceName, displayName }) => {
      const { data: servicesId } = await queryClient.fetchQuery<
        ApiResponse<number[]>
      >({
        queryKey: getResourceServiceIdQueryKey({ resourceName }),
        queryFn: () => getResourceServiceId({ resourceName }),
      });

      if (!servicesId?.[0]) {
        throw new Error(
          `No service found for resource ${resourceName}, cannot update display name`,
        );
      }

      return updateService({ serviceId: servicesId[0], displayName });
    },
    ...options,
  });
  return {
    updateDisplayName,
    ...mutation,
  };
};
