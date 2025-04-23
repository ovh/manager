import { useQuery } from '@tanstack/react-query';
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
  return useQuery({
    queryKey: ['serviceInfoList', serviceName],
    queryFn: async () => {
      const [allDomProperty, serviceInfo, domainAttached] = await Promise.all([
        getAllDomProperty(serviceName),
        getallDomService(serviceName),
        getAllDomainAttachedToAllDom(serviceName),
      ]);
      return { allDomProperty, serviceInfo, domainAttached };
    },
  });
};
