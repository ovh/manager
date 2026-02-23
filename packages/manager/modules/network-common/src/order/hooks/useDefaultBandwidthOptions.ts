import { useQuery } from '@tanstack/react-query';

import { getPublicRoutingRegion } from '../../vrack';

export const vrackPublicRoutingRegionQueryKey = ['vrackPublicRoutingRegion'];

export function useVrackDefaultBandwidthCartOptions() {
  return useQuery({
    queryKey: vrackPublicRoutingRegionQueryKey,
    queryFn: async () => {
      const result = await getPublicRoutingRegion();

      return {
        isDefaultBandwidthOption: ({
          region,
          bandwidthLimit,
        }: {
          region: string;
          bandwidthLimit: number;
        }) =>
          result.data?.find((r) => r.region === region)
            ?.defaultBandwidthLimit === bandwidthLimit,
        routingList: result.data,
        routingByRegion: result.data?.reduce((acc, region) => {
            acc[region.region] = {
              bandwidthLimit: region.defaultBandwidthLimit,
              publicRoutingType: region.publicRoutingType,
            };
            return acc;
          }, {} as Record<string, { bandwidthLimit: number; publicRoutingType: string }>) ?? {},
      };
    },
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });
}
