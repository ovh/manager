import { useQuery } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import { PublicRoutingBandwidthLimit, getPublicRoutingBandwidthLimit } from '../api';

export const getPublicRoutingBandwidthLimitQueryKey = ({
  serviceName,
  region,
}: {
  serviceName: string;
  region?: string;
}) => [`/vrack/${serviceName}/publicRoutingBandwidthLimit`, region];

export const useGetPublicRoutingBandwidthLimits = ({
  serviceName = '',
  region,
}: {
  serviceName?: string;
  region?: string;
}) => {
  const { data, isLoading, isError, error } = useQuery<PublicRoutingBandwidthLimit[], ApiError>({
    queryKey: getPublicRoutingBandwidthLimitQueryKey({ serviceName, region }),
    queryFn: () => getPublicRoutingBandwidthLimit({ serviceName, region }),
    retry: false,
    enabled: serviceName !== '',
  });

  return { bandwidthLimits: data, isLoading, isError, error };
};
