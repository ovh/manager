import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { usePlatform } from '@/hooks';

import {
  DiagnosticResponse,
  getZimbraPlatformDomainDiagnostic,
  getZimbraPlatformDomainDiagnosticQueryKey,
} from '@/api/domain';

type UseDomainDiagnosticParams = Omit<
  UseQueryOptions,
  'queryKey' | 'queryFn'
> & {
  domainId: string;
};

export const useDomainDiagnostic = (params: UseDomainDiagnosticParams) => {
  const { domainId, ...options } = params;
  const { platformId } = usePlatform();

  return useQuery({
    queryKey: getZimbraPlatformDomainDiagnosticQueryKey(platformId, domainId),
    queryFn: () => getZimbraPlatformDomainDiagnostic(platformId, domainId),
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!platformId &&
      !!domainId,
    ...options,
  }) as UseQueryResult<DiagnosticResponse>;
};
