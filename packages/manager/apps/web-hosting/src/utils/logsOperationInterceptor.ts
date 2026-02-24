import { QueryClient } from '@tanstack/react-query';

import { v6 } from '@ovh-ux/manager-core-api';

interface LogSubscription {
  serviceName: string;
}

interface LogService {
  serviceName: string;
}

/**
 * Get LDP account serviceName from React Query cache
 * Tries subscriptions first, then log services as fallback
 */
const getLdpServiceName = (queryClient: QueryClient): string | undefined => {
  const subscriptionsCache = queryClient.getQueryCache().findAll({
    queryKey: ['getLogSubscriptions'],
  });

  for (const query of subscriptionsCache) {
    const subscriptions = query.state.data as LogSubscription[] | undefined;
    if (subscriptions?.length > 0) {
      return subscriptions[0].serviceName;
    }
  }

  const logServicesCache = queryClient.getQueryCache().findAll({
    queryKey: ['getLogServices'],
  });

  for (const query of logServicesCache) {
    const services = query.state.data as LogService[] | undefined;
    if (services?.length > 0) {
      return services[0].serviceName;
    }
  }

  return undefined;
};

/**
 * Setup interceptor to replace hosting serviceName with LDP account in polling calls
 * For /dbaas/logs/{serviceName}/operation/{operationId} endpoint,
 * the serviceName must be the LDP account, not the hosting service
 */
export const setupLogsOperationInterceptor = (
  queryClient: QueryClient,
  hostingServiceName: string,
) => {
  const interceptorId = v6.interceptors.request.use((config) => {
    if (!config.url) {
      return config;
    }

    const escapedServiceName = hostingServiceName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const operationPattern = new RegExp(`/dbaas/logs/${escapedServiceName}/operation/`);

    if (operationPattern.test(config.url)) {
      const ldpServiceName = getLdpServiceName(queryClient);

      if (ldpServiceName) {
        config.url = config.url.replace(
          `/dbaas/logs/${hostingServiceName}/operation/`,
          `/dbaas/logs/${ldpServiceName}/operation/`,
        );
      }
    }

    return config;
  });

  return () => {
    v6.interceptors.request.eject(interceptorId);
  };
};
