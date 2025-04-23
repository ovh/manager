import { useQuery } from '@tanstack/react-query';
import {
  getallDomList,
  getallDomService,
} from '@/alldoms/data/api/web-domains';

export const useGetAllDomServiceList = () => {
  return useQuery<string[]>({
    queryKey: ['allDom', 'services'],
    queryFn: () => getallDomList(),
  });
};

export const useGetAllDomService = (serviceName: string) => {
  return useQuery({
    queryKey: ['allDom', 'services', serviceName],
    queryFn: () => getallDomService(serviceName),
  });
};
