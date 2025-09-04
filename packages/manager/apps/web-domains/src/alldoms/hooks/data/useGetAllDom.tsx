import { useQueries } from '@tanstack/react-query';
import { getAllDomResource } from '@/alldoms/data/api/web-domains';
import { findContact } from '@/alldoms/utils/utils';
import {
  ServiceInfoContactEnum,
  ServiceRoutes,
} from '@/alldoms/enum/service.enum';
import { AlldomService } from '@/alldoms/types';
import { getServiceInformation } from '@/common/data/api/common.api';

interface UseGetDatagridServiceInfoProps {
  readonly serviceName: string;
}

export const useGetAllDom = ({
  serviceName,
}: UseGetDatagridServiceInfoProps) => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['allDom', 'service', serviceName],
        queryFn: () => getServiceInformation(serviceName, ServiceRoutes.AllDom),
      },
      {
        queryKey: ['allDom', 'domains', serviceName],
        queryFn: () => getAllDomResource(serviceName),
      },
    ],
    combine: (results) => {
      const serviceInfo = results[0].data;
      const allDomResource = results[1].data;

      if (!serviceInfo || !allDomResource) {
        return {
          data: {} as AlldomService,
          isLoading: results.some((r) => r.isLoading),
        };
      }

      const { contacts } = serviceInfo.customer;
      const { lifecycle, renew, expirationDate } = serviceInfo.billing;

      return {
        data: {
          currentState: allDomResource.currentState,
          nicAdmin: findContact(contacts, ServiceInfoContactEnum.Administrator),
          nicBilling: findContact(contacts, ServiceInfoContactEnum.Billing),
          nicTechnical: findContact(contacts, ServiceInfoContactEnum.Technical),
          pendingActions: lifecycle?.current.pendingActions ?? [],
          renewMode: renew?.current?.mode,
          creationDate: lifecycle?.current?.creationDate,
          expirationDate,
          renewalDate: renew?.current?.nextDate,
          serviceId: serviceInfo.serviceId,
        } as AlldomService,
        isLoading: results.some((r) => r.isLoading),
      };
    },
  });

  return queries;
};
