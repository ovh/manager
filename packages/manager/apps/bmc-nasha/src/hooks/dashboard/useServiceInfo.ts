import { useQuery } from '@tanstack/react-query';

import { v6 as httpV6 } from '@ovh-ux/manager-core-api';

import { APP_FEATURES } from '@/App.constants';
import { SERVICE_TYPE } from '@/constants/Nasha.constants';

type ServiceInfo = {
  serviceId: number;
  serviceType: string;
  [key: string]: unknown;
};

const QUERY_KEY = (serviceName: string) => ['nasha-service-info', serviceName] as const;

/**
 * Hook to fetch service information
 * Equivalent to serviceInfo resolve in dashboard.routing.js
 */
export function useServiceInfo(serviceName: string) {
  return useQuery<ServiceInfo>({
    queryKey: QUERY_KEY(serviceName),
    queryFn: async () => {
      const { data } = await httpV6.get<ServiceInfo>(
        `${APP_FEATURES.listingEndpoint}/${serviceName}/serviceInfos`,
      );
      return {
        ...data,
        serviceType: SERVICE_TYPE,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: false,
  });
}
