import { useQueries } from '@tanstack/react-query';
import { getVrackList } from '../api/vrack';
import { ServiceType } from '../api/ips';

export const ipParkingOptionValue = 'parking';

/**
 * Fetch the list of available services to order an additional IP
 */
export const useServiceList = () => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['dedicatedCloud'],
        queryFn: () => [],
      },
      {
        queryKey: ['server'],
        queryFn: () => [],
      },
      {
        queryKey: ['vps'],
        queryFn: () => [],
      },
      {
        queryKey: ['vrack'],
        queryFn: getVrackList,
      },
    ],
  });

  return {
    getServiceType: (serviceId: string) => {
      if (serviceId === ipParkingOptionValue) {
        return ServiceType.ipParking;
      }
      if (queries[0]?.data?.includes(serviceId)) {
        return ServiceType.dedicatedCloud;
      }
      if (queries[1]?.data?.includes(serviceId)) {
        return ServiceType.server;
      }
      if (queries[2]?.data?.includes(serviceId)) {
        return ServiceType.vps;
      }
      return queries[3]?.data?.data?.includes(serviceId)
        ? ServiceType.vrack
        : ServiceType.unknown;
    },
    dedicatedCloud: queries[0]?.data,
    server: queries[1],
    vps: queries[2],
    vrack: queries[3]?.data?.data,
    isError: queries.some((query) => query.isError),
    error: queries.find((query) => query.error),
    isLoading: queries.some((query) => query.isLoading),
  };
};
