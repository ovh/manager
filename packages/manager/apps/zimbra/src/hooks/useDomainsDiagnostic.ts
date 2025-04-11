import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  DomainDiagnosisResponse,
  getZimbraPlatformDomainsDiagnosticQueryKey,
  postZimbraPlatformDomainsDiagnostic,
} from '@/api/domain';

type UseDomainsDiagnosticParams = Omit<
  UseQueryOptions,
  'queryKey' | 'queryFn'
> & {
  domainIds: string[];
};

export const useDomainsDiagnostic = (params: UseDomainsDiagnosticParams) => {
  const { domainIds, ...options } = params;
  const { platformId } = useParams();

  return useQuery({
    queryKey: getZimbraPlatformDomainsDiagnosticQueryKey(platformId, domainIds),
    queryFn: () => postZimbraPlatformDomainsDiagnostic(platformId, domainIds),
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!platformId &&
      !!domainIds &&
      !!domainIds.length,
    ...options,
  }) as UseQueryResult<DomainDiagnosisResponse[]>;
};
