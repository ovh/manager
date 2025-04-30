import { useQueries } from '@tanstack/react-query';
import {
  getAllDomainAttachedToAllDom,
  getAllDomProperty,
  getallDomService,
  getDomainDetailInformation,
} from '@/alldoms/data/api/web-domains';
import { TServiceDetail, TServiceProperty } from '@/alldoms/types';

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
          getDomainDetailInformation(serviceName.name),
        ]);
        return { allDomProperty, serviceInfo, domainAttached };
      },
    })),
  });

  const data = queries
    .map((query) => query.data)
    .filter(Boolean) as TServiceDetail[];

  const listLoading = queries.some((query) => query.isLoading);

  return { data, listLoading };
};
