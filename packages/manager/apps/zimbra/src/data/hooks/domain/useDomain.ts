import { useParams } from 'react-router-dom';

import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import {
  DomainType,
  getZimbraPlatformDomainDetail,
  getZimbraPlatformDomainQueryKey,
} from '@/data/api';

type UseDomainParams = Omit<UseQueryOptions, 'queryKey' | 'queryFn'> & {
  domainId?: string;
};

export const useDomain = (params: UseDomainParams = {}) => {
  const { domainId: paramId, ...options } = params;
  const { platformId, domainId } = useParams();
  const id = paramId || domainId;

  return useQuery({
    queryKey: getZimbraPlatformDomainQueryKey(platformId, id),
    queryFn: () => getZimbraPlatformDomainDetail(platformId, id),
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!platformId &&
      !!id,
    ...options,
  }) as UseQueryResult<DomainType>;
};
