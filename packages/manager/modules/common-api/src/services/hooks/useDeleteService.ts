import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  MutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getResourceServiceId,
  getResourceServiceIdQueryKey,
  deleteService,
} from '../api';

export type DeleteServiceMutationParams = {
  resourceName: string;
};

export const deleteServiceMutationKey = ['delete-service'];

export type UseDeleteServiceParams = MutationOptions<
  ApiResponse<{ message: string }>,
  ApiError,
  DeleteServiceMutationParams
>;

export const useDeleteService = ({
  mutationKey = deleteServiceMutationKey,
  ...options
}: UseDeleteServiceParams) => {
  const queryClient = useQueryClient();
  const { mutate: terminateService, ...mutation } = useMutation({
    mutationKey,
    mutationFn: async ({ resourceName }) => {
      const { data } = await queryClient.fetchQuery<
        ApiResponse<number[]>,
        ApiError
      >({
        queryKey: getResourceServiceIdQueryKey({ resourceName }),
        queryFn: () => getResourceServiceId({ resourceName }),
      });
      return deleteService({ serviceId: data[0] });
    },
    ...options,
  });

  return {
    terminateService,
    ...mutation,
  };
};
