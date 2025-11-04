import { useQuery } from '@tanstack/react-query';
import { getAllDomResource } from '@/alldoms/data/api/web-domains';
import { ServiceRoutes } from '@/alldoms/enum/service.enum';
import {
  getMXPlan,
  getServiceInformation,
  getZimbra,
} from '@/common/data/api/common.api';
import { TMxPlan, TZimbra } from '@/common/types/common.types';

export const useGetServiceInformation = (
  serviceName: string,
  serviceRoute: ServiceRoutes,
) => {
  return useQuery({
    queryKey: ['allDom', 'services', serviceName],
    queryFn: () => getServiceInformation(serviceName, serviceRoute),
  });
};

export const useGetAllDomResource = (serviceName: string) => {
  return useQuery({
    queryKey: ['allDom', 'domains', 'services', serviceName],
    queryFn: () => getAllDomResource(serviceName),
  });
};
