import { useQuery } from '@tanstack/react-query';
import { getHostingService } from '../api/dashboard';

export const useGetHostingService = (serviceName: string) =>
  useQuery({
    queryKey: ['hosting-web', serviceName],
    queryFn: () => getHostingService(serviceName),
    enabled: Boolean(serviceName),
  });
