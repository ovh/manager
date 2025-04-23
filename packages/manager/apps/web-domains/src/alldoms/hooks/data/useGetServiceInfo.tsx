import { useQueries } from '@tanstack/react-query';
import {
  getAllDomainAttachedToAllDom,
  getAllDomProperty,
  getallDomService,
} from '@/alldoms/data/api/web-domains';

interface UseGetDatagridServiceInfoProps {
  readonly serviceName: string;
}

export const useGetServiceInfo = ({
  serviceName,
}: UseGetDatagridServiceInfoProps) => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['allDomProperty', serviceName],
        queryFn: () => getAllDomProperty(serviceName),
      },
      {
        queryKey: ['serviceInfo', serviceName],
        queryFn: () => getallDomService(serviceName),
      },
      {
        queryKey: ['domainAttached', serviceName],
        queryFn: () => getAllDomainAttachedToAllDom(serviceName),
      },
    ],
    combine: (results) => {
      return {
        data: {
          allDomProperty: results[0].data,
          serviceInfo: results[1].data,
          domainAttached: results[2].data,
        },
        isLoading: results.some((r) => r.isLoading),
      };
    },
  });

  return queries;
};
