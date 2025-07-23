import { useParams } from 'react-router-dom';

import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import { AliasType, getZimbraPlatformAlias, getZimbraPlatformAliasQueryKey } from '@/data/api';

type UseAliasParams = Omit<UseQueryOptions, 'queryKey' | 'queryFn'> & {
  aliasId?: string;
};

export const useAlias = (params: UseAliasParams = {}) => {
  const { aliasId: paramId, ...options } = params;
  const { platformId, aliasId } = useParams();
  const id = paramId || aliasId;

  return useQuery({
    queryKey: getZimbraPlatformAliasQueryKey(platformId, id),
    queryFn: () => getZimbraPlatformAlias(platformId, id),
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!platformId &&
      !!id,
    ...options,
  }) as UseQueryResult<AliasType>;
};
