import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { usePlatform } from '@/data/hooks';
import {
  DomainDiagnosisResponse,
  getZimbraPlatformDomainsDiagnosticQueryKey,
  postZimbraPlatformDomainsDiagnostic,
} from '@/data/api';

type UseDomainDiagnosticParams = Omit<
  UseQueryOptions,
  'queryKey' | 'queryFn' | 'select'
> & {
  domainId: string;
};

export const useDomainDiagnostic = (params: UseDomainDiagnosticParams) => {
  const { domainId, ...options } = params;
  const { platformId } = usePlatform();

  return useQuery({
    queryKey: getZimbraPlatformDomainsDiagnosticQueryKey(platformId, [
      domainId,
    ]),
    queryFn: () => postZimbraPlatformDomainsDiagnostic(platformId, [domainId]),
    enabled: (query) =>
      (typeof options.enabled === 'function'
        ? options.enabled(query)
        : typeof options.enabled !== 'boolean' || options.enabled) &&
      !!platformId &&
      !!domainId,
    select: (data: DomainDiagnosisResponse[]) => {
      return data.find((diag) => diag.domainId === domainId);
    },
    ...options,
  }) as UseQueryResult<DomainDiagnosisResponse>;
};
