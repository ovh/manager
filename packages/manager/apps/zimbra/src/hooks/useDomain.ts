import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { usePlatform } from '@/hooks';

import {
  DomainType,
  getZimbraPlatformDomainDetail,
  getZimbraPlatformDomainQueryKey,
} from '@/api/domain';

type UseDomainParams = Omit<UseQueryOptions, 'queryKey' | 'queryFn'> & {
  domainId: string;
};

export const useDomain = (params: UseDomainParams) => {
  const { domainId, ...options } = params;
  const { platformId } = usePlatform();

  return useQuery({
    queryKey: getZimbraPlatformDomainQueryKey(platformId, domainId),
    queryFn: () => getZimbraPlatformDomainDetail(platformId, domainId),
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!platformId &&
      !!domainId,
    ...options,
  }) as UseQueryResult<DomainType>;
};
