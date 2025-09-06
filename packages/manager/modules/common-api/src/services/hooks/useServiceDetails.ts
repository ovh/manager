import {
  DefinedInitialDataOptions,
  queryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import { getResourceServiceId, getResourceServiceIdQueryKey, getServiceDetails } from '../api';
import { ServiceDetails } from '../services.type';

export const getServiceDetailsQueryKey = (resourceName: string) => [
  'service-details',
  resourceName,
];

export const useServiceDetailsQueryOption = ({ resourceName }: { resourceName: string }) => {
  const queryClient = useQueryClient();

  return queryOptions<ApiResponse<ServiceDetails>, ApiError>({
    queryKey: getServiceDetailsQueryKey(resourceName),
    queryFn: async () => {
      const { data } = await queryClient.fetchQuery<ApiResponse<number[]>, ApiError>({
        queryKey: getResourceServiceIdQueryKey({ resourceName }),
        queryFn: () => getResourceServiceId({ resourceName }),
      });
      return getServiceDetails(data[0] ?? 0);
    },
    enabled: () => !!resourceName,
  });
};

export type UseServiceDetailsParams = {
  queryKey?: string[];
  resourceName: string;
  options?: Partial<DefinedInitialDataOptions<ApiResponse<ServiceDetails>, ApiError>>;
};

/**
 * @deprecated Use useServiceDetailsQueryOption with new tanstack method : https://tanstack.com/query/v5/docs/framework/react/guides/query-options
 */
export const useServiceDetails = ({ resourceName, options = {} }: UseServiceDetailsParams) => {
  const serviceDetailsOptions = useServiceDetailsQueryOption({ resourceName });
  return useQuery({
    ...serviceDetailsOptions,
    ...options,
  });
};
