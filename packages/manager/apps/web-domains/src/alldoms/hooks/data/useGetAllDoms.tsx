import { useQueries } from '@tanstack/react-query';
import { ServiceRoutes } from '@/alldoms/enum/service.enum';
import { getServiceInformation } from '@/common/data/api/common.api';

interface UseGetDatagridServiceInfoListProps {
  readonly names: string[];
}

export const useGetAllDoms = ({
  names,
}: UseGetDatagridServiceInfoListProps) => {
  const { data, listLoading } = useQueries({
    queries: names
      ? names.map((name) => ({
          queryKey: ['serviceInfo', name],
          queryFn: () => getServiceInformation(name, ServiceRoutes.AllDom),
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
