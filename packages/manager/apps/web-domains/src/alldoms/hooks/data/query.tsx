import { useQuery } from '@tanstack/react-query';
import {
  getAllDomainAttachedToAllDom,
  getallDomList,
} from '@/alldoms/data/api/web-domains';

export const useGetAllDomServiceList = () => {
  return useQuery<string[]>({
    queryKey: ['list'],
    queryFn: () => getallDomList(),
  });
};

export const useGetAllDomainAttachedToAllDom = (serviceName: string) => {
  return useQuery<string[]>({
    queryKey: [serviceName],
    queryFn: () => getAllDomainAttachedToAllDom(serviceName),
  });
};
