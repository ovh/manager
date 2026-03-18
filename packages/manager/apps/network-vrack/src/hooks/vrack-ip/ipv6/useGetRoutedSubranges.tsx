import { UseQueryOptions, useQueries } from '@tanstack/react-query';

import { ApiError } from '@ovh-ux/manager-core-api';

import {
  Ipv6RoutedSubrangeDetails,
  getVrackIpv6RoutedSubrangeDetail,
  getVrackIpv6RoutedSubranges,
} from '@/data/api/get/routedSubrange';

import { getVrackIpv6ListKey } from './useGetVrackIpv6List';

export const getVrackIpv6RoutedSubrangesKey = (serviceName: string, ip: string) => [
  getVrackIpv6ListKey(serviceName),
  `${encodeURIComponent(ip)}/routedSubrange`,
];

export const getVrackIpv6RoutedSubrangeDetailKey = (
  serviceName: string,
  ip: string,
  subrange: string,
) => [...getVrackIpv6RoutedSubrangesKey(serviceName, ip), encodeURIComponent(subrange)];

export const useGetRoutedSubranges = (serviceName: string = '', ipv6List: string[]) => {
  const routedSubrangeMapper = useQueries({
    queries: (ipv6List ?? []).map(
      (ipv6: string): UseQueryOptions<{ ipv6: string; subranges: string[] }, ApiError> => ({
        queryKey: getVrackIpv6RoutedSubrangesKey(serviceName, ipv6),
        queryFn: async () => {
          const subranges = await getVrackIpv6RoutedSubranges(serviceName, ipv6);
          return { ipv6, subranges };
        },
        enabled: serviceName !== '' && !!ipv6List?.length,
      }),
    ),
  });

  const routedSubranges = routedSubrangeMapper
    .filter(({ data }) => !!data)
    .flatMap(({ data }) =>
      data?.subranges.map((subrange) => ({ ipv6: data.ipv6, subrange })),
    ) as Array<{ ipv6: string; subrange: string }>;

  const detailedRoutedSubranges = useQueries({
    queries: (routedSubranges ?? []).map(
      ({
        ipv6,
        subrange,
      }): UseQueryOptions<{ ipv6: string; subrange: Ipv6RoutedSubrangeDetails }, ApiError> => ({
        queryKey: getVrackIpv6RoutedSubrangeDetailKey(serviceName, ipv6, subrange),
        queryFn: async () => {
          const subRangeDetail = await getVrackIpv6RoutedSubrangeDetail(
            serviceName,
            ipv6,
            subrange,
          );
          return { ipv6, subrange: subRangeDetail };
        },
        enabled: serviceName !== '' && !!routedSubranges?.length,
      }),
    ),
  });

  return {
    detailedRoutedSubranges,
  };
};
