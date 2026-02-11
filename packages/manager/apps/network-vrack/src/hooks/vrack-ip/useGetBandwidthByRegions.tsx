import { Ipv6Detail } from '@/data/api/get/vrackIp';

import { useGetVrackDetails } from '../vrack/useGetVrackDetails';
import { useGetVrackIpv4ListDetails } from './ipv4/useGetVrackIpv4ListDetails';
import { useGetVrackIpv6ListDetails } from './ipv6/useGetVrackIpv6ListDetails';
import { useGetPublicRoutingBandwidthLimits } from './useGetPublicRoutingBandwidthLimits';

type RegionWithBandwidth = {
  region: string;
  bandwidthLimitType: 'upgraded' | 'default';
  bandwidthLimit: number;
  ipv4List: string[];
  ipv6List: Ipv6Detail[];
};

export const useGetBandwidthByRegions = (
  serviceName: string = '',
): { regionsWithBandwidth: RegionWithBandwidth[]; isLoading: boolean } => {
  const { bandwidthLimits = [], isLoading: isLoadingBandwidthLimits } =
    useGetPublicRoutingBandwidthLimits(serviceName);
  const { data: vrack, isLoading: isLoadingVrack } = useGetVrackDetails(serviceName);
  const { ipsWithDetail: ipv4List, isLoading: isLoadingIpv4 } = useGetVrackIpv4ListDetails(
    vrack?.serviceName,
  );
  const { ipsWithDetail: ipv6List, isLoading: isLoadingIpv6 } = useGetVrackIpv6ListDetails(
    vrack?.serviceName,
  );

  const isLoading = isLoadingBandwidthLimits || isLoadingVrack || isLoadingIpv4 || isLoadingIpv6;

  const regionsWithBandwidth = !isLoading
    ? bandwidthLimits
        .map(({ region, bandwidthLimit, bandwidthLimitType }) => ({
          region,
          bandwidthLimit,
          bandwidthLimitType,
          ipv4List: ipv4List.filter((ip) => ip.region === region).map(({ ip }) => ip),
          ipv6List: ipv6List.filter((ip) => ip.region === region),
        }))
        .filter(
          ({ ipv4List, ipv6List, bandwidthLimitType }) =>
            ipv4List.length || ipv6List.length || bandwidthLimitType === 'upgraded',
        )
    : [];

  return {
    regionsWithBandwidth,
    isLoading,
  };
};
