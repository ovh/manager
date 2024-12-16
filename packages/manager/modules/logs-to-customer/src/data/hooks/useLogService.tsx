import { useQuery } from '@tanstack/react-query';
import { getLogService } from '../api/logService';

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
