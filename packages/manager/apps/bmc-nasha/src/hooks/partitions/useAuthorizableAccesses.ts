import { useQuery } from '@tanstack/react-query';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';
import { sortByIpBlock } from '@/utils/Ip.utils';

type AuthorizableAccess = {
  type: 'IP' | 'IP/Block';
  ip: string;
};

const QUERY_KEY = (serviceName: string, partitionName: string) =>
  ['nasha-authorizable-accesses', serviceName, partitionName] as const;

/**
 * Hook to fetch authorizable IPs and blocks for a partition
 */
export function useAuthorizableAccesses(serviceName: string, partitionName: string) {
  return useQuery<AuthorizableAccess[]>({
    queryKey: QUERY_KEY(serviceName, partitionName),
    queryFn: async () => {
      const [ipsResponse, blocksResponse] = await Promise.all([
        httpV6.get<string[]>(
          `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}/authorizableIps`,
        ),
        httpV6.get<string[]>(
          `${APP_FEATURES.listingEndpoint}/${serviceName}/partition/${partitionName}/authorizableBlocks`,
        ),
      ]);

      const ips = (ipsResponse.data || []).map((ip) => ({
        type: 'IP' as const,
        ip: `${ip}/32`,
      }));

      const blocks = (blocksResponse.data || []).map((block) => ({
        type: 'IP/Block' as const,
        ip: block,
      }));

      // Sort by IP block number (same as AngularJS implementation)
      // This ensures consistent sorting: 10.0.0.0 < 172.16.0.0 < 192.168.0.0
      return [...ips, ...blocks].sort((a, b) => sortByIpBlock(a.ip, b.ip));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}
