import { useQueries } from '@tanstack/react-query';
import {
  getAllDomResource,
  getServiceInformation,
} from '@/alldoms/data/api/web-domains';
import { TServiceDetail, TServiceProperty } from '@/alldoms/types';
import { findContact } from '@/alldoms/utils/utils';
import {
  ServiceInfoContactEnum,
  ServiceRoutes,
} from '@/alldoms/enum/service.enum';

interface UseGetDatagridServiceInfoListProps {
  readonly allDomList: TServiceProperty[];
}

export const useGetAllDoms = ({
  allDomList = [],
}: UseGetDatagridServiceInfoListProps) => {
  const queries = useQueries({
    queries: allDomList.map((allDom) => ({
      queryKey: ['serviceInfoList', allDom.name],
      queryFn: async () => {
        const [serviceInfo, allDomResource] = await Promise.all([
          getServiceInformation(allDom.name, ServiceRoutes.AllDom),
          getAllDomResource(allDom.name),
        ]);

        const contacts = serviceInfo?.customer?.contacts ?? [];

        return {
          serviceInfo,
          allDomResource,
          nicAdmin: findContact(contacts, ServiceInfoContactEnum.Administrator),
          nicBilling: findContact(contacts, ServiceInfoContactEnum.Billing),
          nicTechnical: findContact(contacts, ServiceInfoContactEnum.Technical),
          allDomResourceState:
            serviceInfo?.billing?.lifecycle?.capacities?.actions[0],
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
