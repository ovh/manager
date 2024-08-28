import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getResourceServiceId,
  getResourceServiceIdQueryKey,
  getServiceDetails,
} from '../api';
import { ServiceDetails } from '../services.type';

export const serviceDetailsQueryKey = ['service-details'];

export type UseServiceDetailsParams = {
  queryKey?: string[];
  resourceName: string;
};

export const useServiceDetails = ({
  queryKey = serviceDetailsQueryKey,
  resourceName,
}: UseServiceDetailsParams) => {
  const queryClient = useQueryClient();
  return useQuery<ApiResponse<ServiceDetails>, ApiError>({
    queryKey,
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
  });
};
