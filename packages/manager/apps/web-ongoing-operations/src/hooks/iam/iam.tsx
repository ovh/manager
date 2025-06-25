import { useQuery } from '@tanstack/react-query';
import { getIamResourceAllDom, IAMResource } from '@/data/api/iam';

export const useGetIAMResourceAllDom = () => {
  return useQuery<IAMResource[]>({
    queryKey: ['iam', 'alldom', 'resource'],
    queryFn: () => getIamResourceAllDom(),
  });
};
