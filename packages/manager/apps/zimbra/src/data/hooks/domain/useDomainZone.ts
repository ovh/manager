import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import { ZoneWithIAM, getDomainZoneByName, getDomainZoneByNameQueryKey } from '@/data/api';

type UseDomainZoneParams = Omit<UseQueryOptions, 'queryKey' | 'queryFn'> & {
  name: string;
};

export const useDomainZone = (params: UseDomainZoneParams) => {
  const { name, ...options } = params;

  return useQuery({
    queryKey: getDomainZoneByNameQueryKey(name),
    queryFn: () => getDomainZoneByName(name),
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) && !!name,
    ...options,
  }) as UseQueryResult<ZoneWithIAM>;
};
