import { ApiError, ApiResponse } from '../../useCoreApiClient';
import { useQueryClient, useMutation } from '@tanstack/react-query';
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
  displayName?: string;
};

export type UseUpdateServiceDisplayNameParams = {
  onSuccess?: () => void;
  onError?: (result: ApiError) => void;
  mutationKey?: string[];
};

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
