import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  DefinedInitialDataOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getResourceServiceId,
  getResourceServiceIdQueryKey,
  getServiceDetails,
} from '../api';
import { ServiceDetails } from '../services.type';

export const getServiceDetailsQueryKey = (resourceName: string) => [
  'service-details',
  resourceName,
];

export type UseServiceDetailsParams = {
  queryKey?: string[];
  resourceName: string;
  options?: Partial<
    DefinedInitialDataOptions<ApiResponse<ServiceDetails>, ApiError>
  >;
};

export const useServiceDetails = ({
  queryKey,
  resourceName,
  options = {},
}: UseServiceDetailsParams) => {
  const queryClient = useQueryClient();
  return useQuery<ApiResponse<ServiceDetails>, ApiError>({
    queryKey: queryKey ?? getServiceDetailsQueryKey(resourceName),
    queryFn: async () => {
      const { data } = await queryClient.fetchQuery<
        ApiResponse<number[]>,
        ApiError
      >({
        queryKey: getResourceServiceIdQueryKey({ resourceName }),
        queryFn: () => getResourceServiceId({ resourceName }),
      });
      return getServiceDetails(data[0]);
    },
    ...options,
  });
};
