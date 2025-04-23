import { useQueries } from '@tanstack/react-query';
import {
  getAllDomainAttachedToAllDom,
  getAllDomProperty,
  getallDomService,
  getDomainDetailInformation,
} from '@/alldoms/data/api/web-domains';
import { findContact } from '@/alldoms/utils/utils';
import { ServiceInfoContactEnum } from '@/alldoms/enum/service.enum';

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
        queryFn: () => getDomainDetailInformation(serviceName),
      },
    ],
    combine: (results) => {
      const allDomProperty = results[0].data;
      const serviceInfo = results[1].data;
      const domainAttached = results[2].data;
      const contacts = serviceInfo?.customer?.contacts ?? [];
      return {
        data: {
          allDomProperty,
          serviceInfo,
          domainAttached,
          nicAdmin: findContact(contacts, ServiceInfoContactEnum.Administrator),
          nicBilling: findContact(contacts, ServiceInfoContactEnum.Billing),
          nicTechnical: findContact(contacts, ServiceInfoContactEnum.Technical),
        },
        isLoading: results.some((r) => r.isLoading),
      };
    },
  });

  return queries;
};
