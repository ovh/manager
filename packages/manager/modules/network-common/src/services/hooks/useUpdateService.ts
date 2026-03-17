import {
  MutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import {
  UpdateServiceParams,
  getResourceServiceId,
  getResourceServiceIdQueryKey,
  updateService,
} from '../api';

export type UpdateServiceMutationParams = {
  /** Resource name or id */
  resourceName: string;
} & Omit<UpdateServiceParams, 'serviceId'>;

export type UseUpdateServiceParams = MutationOptions<
  ApiResponse<{ message: string }>,
  ApiError | Error,
  UpdateServiceMutationParams
>;

export const useUpdateService = (options: UseUpdateServiceParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resourceName, ...params }) => {
      const { data: servicesId } = await queryClient.fetchQuery<
        ApiResponse<number[]>
      >({
        queryKey: getResourceServiceIdQueryKey({ resourceName }),
        queryFn: () => getResourceServiceId({ resourceName }),
      });

      if (!servicesId?.[0]) {
        throw new Error(
          `No service found for resource ${resourceName}, cannot update service`,
        );
      }

      return updateService({ serviceId: servicesId[0], ...params });
    },
    ...options,
  });
};
