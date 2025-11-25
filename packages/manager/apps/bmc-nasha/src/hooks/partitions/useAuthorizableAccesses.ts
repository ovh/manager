import { useQuery } from '@tanstack/react-query';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';

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

      return [...ips, ...blocks].sort((a, b) => {
        // Simple sort by IP (could be improved with proper IP comparison)
        return a.ip.localeCompare(b.ip);
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}
