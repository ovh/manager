import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { getDomainZoneByName, ZoneWithIAM } from '@/api/domain';
import { getDomainZoneByNameQueryKey } from '../api/domain/key';

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
