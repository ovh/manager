import { useQuery } from '@tanstack/react-query';
import { getAllDomResource } from '@/alldoms/data/api/web-domains';

export const useGetAllDomResource = (serviceName: string) => {
  return useQuery({
    queryKey: ['allDom', 'domains', 'services', serviceName],
    queryFn: () => getAllDomResource(serviceName),
  });
};
