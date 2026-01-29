import { useGetVrackDetails } from '../vrack/useGetVrackDetails';
import { useGetPublicRoutingBandwidthLimits } from './useGetPublicRoutingBandwidthLimits';
import { useGetVrackIpv4ListDetails } from './useGetVrackIpv4ListDetails';
import { useGetVrackIpv6ListDetails } from './useGetVrackIpv6ListDetails';

type RegionWithBandwidth = {
  region: string;
  bandwidthLimitType: 'upgraded' | 'default';
  bandwidthLimit: number;
  ipv4List: string[];
  ipv6List: string[];
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
          ipv6List: ipv6List.filter((ip) => ip.region === region).map(({ ipv6 }) => ipv6),
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
