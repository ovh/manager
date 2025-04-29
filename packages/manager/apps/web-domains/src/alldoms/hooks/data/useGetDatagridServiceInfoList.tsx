import { useQueries } from '@tanstack/react-query';
import {
  getAllDomainAttachedToAllDom,
  getAllDomProperty,
  getallDomService,
} from '@/alldoms/data/api/web-domains';
import { TServiceDetail, TServiceProperty } from '@/alldoms/types';
import { findContact } from '@/alldoms/utils/utils';
import { ServiceInfoContactEnum } from '@/alldoms/enum/service.enum';

interface UseGetDatagridServiceInfoListProps {
  readonly allDomList: TServiceProperty[];
}

export const useGetDatagridServiceInfoList = ({
  allDomList = [],
}: UseGetDatagridServiceInfoListProps) => {
  const queries = useQueries({
    queries: allDomList.map((serviceName) => ({
      queryKey: ['serviceInfoList', serviceName.name],
      queryFn: async () => {
        const [
          allDomProperty,
          serviceInfo,
          domainAttached,
        ] = await Promise.all([
          getAllDomProperty(serviceName.name),
          getallDomService(serviceName.name),
          getAllDomainAttachedToAllDom(serviceName.name),
        ]);

        const contacts = serviceInfo?.customer?.contacts ?? [];

        return {
          allDomProperty,
          serviceInfo,
          domainAttached,
          nicAdmin: findContact(contacts, ServiceInfoContactEnum.Administrator),
          nicBilling: findContact(contacts, ServiceInfoContactEnum.Billing),
          nicTechnical: findContact(contacts, ServiceInfoContactEnum.Technical),
        };
      },
    })),
  });

  const data = queries
    .map((query) => query.data)
    .filter(Boolean) as TServiceDetail[];

  const listLoading = queries.some((query) => query.isLoading);

  return { data, listLoading };
};
