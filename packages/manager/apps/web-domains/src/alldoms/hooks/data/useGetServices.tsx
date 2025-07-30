import { useQueries } from '@tanstack/react-query';

import { getServiceInformation } from '@/alldoms/data/api/web-domains';
import { ServiceRoutes } from '@/alldoms/enum/service.enum';

interface UseGetDatagridServiceInfoListProps {
  readonly names: string[];
  readonly serviceRoute: ServiceRoutes;
}

export const useGetServices = ({ names, serviceRoute }: UseGetDatagridServiceInfoListProps) => {
  const { data, listLoading } = useQueries({
    queries: names
      ? names.map((name) => ({
          queryKey: ['allDom', name, serviceRoute],
          queryFn: () => getServiceInformation(name, serviceRoute),
        }))
      : [],
    combine: (results) => {
      return {
        listLoading: results.some((result) => result.isLoading),
        data: results.map((result) => result.data),
      };
    },
  });
  return { data, listLoading };
};
