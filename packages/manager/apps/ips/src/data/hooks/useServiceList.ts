import { useQueries } from '@tanstack/react-query';
import { getVrackList } from '../api/vrack';
import { ServiceType } from '@/types';
import { getServiceList } from '../api/get/serviceList';

export const ipParkingOptionValue = 'parking';

/**
 * Fetch the list of available services to order an additional IP
 */
export const useServiceList = () => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['dedicatedCloud'],
        queryFn: () => getServiceList(ServiceType.dedicatedCloud),
      },
      {
        queryKey: ['server'],
        queryFn: () => getServiceList(ServiceType.server),
      },
      {
        queryKey: ['vps'],
        queryFn: () => getServiceList(ServiceType.vps),
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
      if (
        queries[0]?.data?.data?.results[0]?.services?.some(
          ({ serviceName }) => serviceName === serviceId,
        )
      ) {
        return ServiceType.dedicatedCloud;
      }
      if (
        queries[1]?.data?.data?.results[0]?.services?.some(
          ({ serviceName }) => serviceName === serviceId,
        )
      ) {
        return ServiceType.server;
      }
      if (
        queries[2]?.data?.data?.results[0]?.services?.some(
          ({ serviceName }) => serviceName === serviceId,
        )
      ) {
        return ServiceType.vps;
      }
      return queries[3]?.data?.data?.includes(serviceId)
        ? ServiceType.vrack
        : ServiceType.unknown;
    },
    dedicatedCloud: queries[0]?.data?.data?.results[0]?.services,
    server: queries[1]?.data?.data?.results[0]?.services,
    vps: queries[2]?.data?.data?.results[0]?.services,
    vrack: queries[3]?.data?.data,
    isError: queries.some((query) => query.isError),
    error: queries.find((query) => query.error),
    isLoading: queries.some((query) => query.isLoading),
  };
};
