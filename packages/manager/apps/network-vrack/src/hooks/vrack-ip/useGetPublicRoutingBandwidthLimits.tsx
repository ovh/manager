import { useQuery } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import {
  PublicRoutingBandwidthLimit,
  getPublicRoutingBandwidthLimit,
} from '@/data/api/get/publicRoutingBandwidthLimit';

export const getPublicRoutingBandwidthLimitQueryKey = (serviceName: string) => [
  `/vrack/${serviceName}/publicRoutingBandwidthLimit`,
];

export const useGetPublicRoutingBandwidthLimits = (serviceName: string = '') => {
  const { data, isLoading, isError } = useQuery<PublicRoutingBandwidthLimit[], ApiError>({
    queryKey: getPublicRoutingBandwidthLimitQueryKey(serviceName),
    queryFn: () => getPublicRoutingBandwidthLimit(serviceName),
    retry: false,
    enabled: serviceName !== '',
  });

  return { bandwidthLimits: data, isLoading, isError };
};
