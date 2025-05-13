import { useQuery } from '@tanstack/react-query';
import { getLogService, getLogServices } from '../api/logService';

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
  'getLogService',
  `/dbaas/logs/${serviceName}`,
];

export const useLogService = (serviceName: string) => {
  return useQuery({
    queryKey: getLogServiceQueryKey(serviceName),
    queryFn: () => getLogService(serviceName),
  });
};
