import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  useQueryClient,
  useMutation,
  MutationOptions,
} from '@tanstack/react-query';
import {
  updateServiceName,
  getResourceServiceId,
  getResourceServiceIdQueryKey,
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
      const { data: servicesId } = await queryClient.fetchQuery<
        ApiResponse<number[]>
      >({
        queryKey: getResourceServiceIdQueryKey({ resourceName }),
        queryFn: () => getResourceServiceId({ resourceName }),
      });
      return updateServiceName({ serviceId: servicesId[0], displayName });
    },
    ...options,
  });
  return {
    updateDisplayName,
    ...mutation,
  };
};
