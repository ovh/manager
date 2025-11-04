import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getLogService, getLogServices } from '../api/logService';
import { Service } from '../types/dbaas/logs';

/**
 * Use log Services list
 */
export const getLogServicesQueryKey = () => ['getLogServices'];

export const useLogServices = () => {
  return useQuery({
    queryKey: getLogServicesQueryKey(),
    queryFn: () => getLogServices(),
  });
};

/**
 * Use log Service
 */
export const getLogServiceQueryKey = (serviceName: string) => [
  getLogServicesQueryKey()[0],
  `/dbaas/logs/${serviceName}`,
];

export const useLogService = (serviceName: string): UseQueryResult<Service> => {
  return useQuery<Service>({
    queryKey: getLogServiceQueryKey(serviceName),
    queryFn: () => getLogService(serviceName),
  });
};
