import { useParams } from 'react-router-dom';

import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import {
  RedirectionType,
  getZimbraPlatformRedirection,
  getZimbraPlatformRedirectionQueryKey,
} from '@/data/api';

type UseRedirectionParams = Omit<UseQueryOptions, 'queryKey' | 'queryFn'> & {
  redirectionId?: string;
};

export const useRedirection = (params: UseRedirectionParams = {}) => {
  const { redirectionId: paramId, ...options } = params;
  const { platformId, redirectionId } = useParams();
  const id = paramId || redirectionId;

  return useQuery({
    queryKey: getZimbraPlatformRedirectionQueryKey(platformId, id),
    queryFn: () => getZimbraPlatformRedirection(platformId, id),
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!platformId &&
      !!id,
    ...options,
  }) as UseQueryResult<RedirectionType>;
};
