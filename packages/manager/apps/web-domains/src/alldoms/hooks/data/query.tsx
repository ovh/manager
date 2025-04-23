import { useQuery } from '@tanstack/react-query';
import { getallDomService } from '@/alldoms/data/api/web-domains';

export const useGetAllDomService = (serviceName: string) => {
  return useQuery({
    queryKey: ['allDom', 'services', serviceName],
    queryFn: () => getallDomService(serviceName),
  });
};
