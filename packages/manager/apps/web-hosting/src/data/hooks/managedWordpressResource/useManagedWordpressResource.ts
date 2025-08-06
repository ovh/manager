import { useQuery } from '@tanstack/react-query';
import { getManagedCmsResource } from '@/data/api/managedWordpress';

export const useManagedWordpressResource = () => {
  return useQuery({
    queryKey: ['get', 'managedCMS', 'resource'],
    queryFn: () => getManagedCmsResource(),
  });
};
