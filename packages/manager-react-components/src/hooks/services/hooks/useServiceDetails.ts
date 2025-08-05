/**
 * @deprecated This file is deprecated. Do not use any of its exports.
 * @deprecated file will be removed in MRC v3, all code will be move in @ovh-ux/manager-module-common-api' or already moved
 */
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getResourceServiceId,
  getResourceServiceIdQueryKey,
  getServiceDetails,
} from '../api';
import { ServiceDetails } from '../services.type';

/**
 * @deprecated This function is deprecated and will be removed in MRC V3.
 */
export const getServiceDetailsQueryKey = (resourceName: string) => [
  'service-details',
  resourceName,
];

/**
 * @deprecated The type is deprecated and will be removed in MRC V3.
 */
export type UseServiceDetailsParams = {
  queryKey?: string[];
  resourceName: string;
};

/**
 * @deprecated This hook is deprecated and will be removed in MRC V3.
 */
export const useServiceDetails = ({
  queryKey,
  resourceName,
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
  });
};
