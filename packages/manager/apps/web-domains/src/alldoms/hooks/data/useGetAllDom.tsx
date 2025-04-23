import { useQueries } from '@tanstack/react-query';
import {
  getAllDomResource,
  getAllDomService,
} from '@/alldoms/data/api/web-domains';
import { findContact } from '@/alldoms/utils/utils';
import { ServiceInfoContactEnum } from '@/alldoms/enum/service.enum';

interface UseGetDatagridServiceInfoProps {
  readonly serviceName: string;
}

export const useGetAllDom = ({
  serviceName,
}: UseGetDatagridServiceInfoProps) => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['serviceInfo', serviceName],
        queryFn: () => getAllDomService(serviceName),
      },
      {
        queryKey: ['domainAttached', serviceName],
        queryFn: () => getAllDomResource(serviceName),
      },
    ],
    combine: (results) => {
      const serviceInfo = results[0].data;
      const allDomResource = results[1].data;
      const contacts = serviceInfo?.customer?.contacts ?? [];
      return {
        data: {
          serviceInfo,
          allDomResource,
          nicAdmin: findContact(contacts, ServiceInfoContactEnum.Administrator),
          nicBilling: findContact(contacts, ServiceInfoContactEnum.Billing),
          nicTechnical: findContact(contacts, ServiceInfoContactEnum.Technical),
          allDomResourceState:
            serviceInfo?.billing?.lifecycle?.capacities?.actions[0],
        },
        isLoading: results.some((r) => r.isLoading),
      };
    },
  });

  return queries;
};
