import { useQuery } from '@tanstack/react-query';
import { getallDomList } from '@/alldoms/data/api/web-domains';

export const useGetAllDomServiceList = () => {
  return useQuery<number[]>({
    queryKey: ['list'],
    queryFn: () => getallDomList(),
  });
};
