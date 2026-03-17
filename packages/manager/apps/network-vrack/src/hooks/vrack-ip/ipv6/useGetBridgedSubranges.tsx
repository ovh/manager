import { UseQueryOptions, useQueries } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import {
  Ipv6BridgedSubrangeDetails,
  getVrackIpv6BridgedSubrangeDetail,
  getVrackIpv6BridgedSubranges,
} from '@/data/api/get/bridgedSubrange';

import { getVrackIpv6ListKey } from './useGetVrackIpv6List';

export const getVrackIpv6BridgedSubrangesKey = (serviceName: string, ip: string) => [
  getVrackIpv6ListKey(serviceName),
  `${encodeURIComponent(ip)}/bridgedSubrange`,
];

export const getVrackIpv6BridgedSubrangeDetailKey = (
  serviceName: string,
  ip: string,
  subrange: string,
) => [...getVrackIpv6BridgedSubrangesKey(serviceName, ip), encodeURIComponent(subrange)];

export const useGetBridgedSubranges = (serviceName: string = '', ipv6List: string[]) => {
  const bridgedSubrangeMapper = useQueries({
    queries: (ipv6List ?? []).map(
      (ipv6: string): UseQueryOptions<{ ipv6: string; subranges: string[] }, ApiError> => ({
        queryKey: getVrackIpv6BridgedSubrangesKey(serviceName, ipv6),
        queryFn: async () => {
          const subranges = await getVrackIpv6BridgedSubranges(serviceName, ipv6);
          return { ipv6, subranges };
        },
        enabled: serviceName !== '' && !!ipv6List?.length,
      }),
    ),
  });

  const bridgedSubranges = bridgedSubrangeMapper
    .filter(({ data }) => !!data)
    .flatMap(({ data }) =>
      data?.subranges.map((subrange) => ({ ipv6: data.ipv6, subrange })),
    ) as Array<{ ipv6: string; subrange: string }>;

  const detailedBridgedSubranges = useQueries({
    queries: (bridgedSubranges ?? []).map(
      ({
        ipv6,
        subrange,
      }): UseQueryOptions<{ ipv6: string; subrange: Ipv6BridgedSubrangeDetails }, ApiError> => ({
        queryKey: getVrackIpv6BridgedSubrangeDetailKey(serviceName, ipv6, subrange),
        queryFn: async () => {
          const subRangeDetail = await getVrackIpv6BridgedSubrangeDetail(
            serviceName,
            ipv6,
            subrange,
          );
          return { ipv6, subrange: subRangeDetail };
        },
        enabled: serviceName !== '' && !!bridgedSubranges?.length,
      }),
    ),
  });

  return {
    detailedBridgedSubranges,
  };
};
