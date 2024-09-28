import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '../../useCoreApiClient';
import {
  getResourceServiceId,
  getResourceServiceIdQueryKey,
  deleteService,
} from '../api';

export type DeleteServiceMutationParams = {
  resourceName: string;
};

export const deleteServiceMutationKey = ['delete-service'];

export type UseDeleteServiceParams = {
  onSuccess?: () => void;
  onError?: (result: ApiError) => void;
  mutationKey?: string[];
};

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
