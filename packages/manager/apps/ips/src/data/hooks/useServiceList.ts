import { useQueries } from '@tanstack/react-query';
import { getVrackList } from '../api/vrack';
import { ServiceType } from '@/types';
import {
  getDedicatedCloudServiceList,
  getDedicatedServerList,
  getVpsList,
} from '../api';

export const ipParkingOptionValue = 'parking';

/**
 * Fetch the list of available services to order an additional IP
 */
export const useServiceList = () => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['dedicatedCloud'],
        queryFn: getDedicatedCloudServiceList,
      },
      {
        queryKey: ['server'],
        queryFn: getDedicatedServerList,
      },
      {
        queryKey: ['vps'],
        queryFn: getVpsList,
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
        queries[0]?.data?.data?.some(
          ({ serviceName }) => serviceName === serviceId,
        )
      ) {
        return ServiceType.dedicatedCloud;
      }
      if (
        queries[1]?.data?.data?.some(
          ({ serviceName }) => serviceName === serviceId,
        )
      ) {
        return ServiceType.server;
      }
      if (
        queries[2]?.data?.data?.some(
          ({ serviceName }) => serviceName === serviceId,
        )
      ) {
        return ServiceType.vps;
      }
      return queries[3]?.data?.data?.some(
        ({ serviceName }) => serviceName === serviceId,
      )
        ? ServiceType.vrack
        : ServiceType.unknown;
    },
    dedicatedCloud: queries[0]?.data?.data,
    server: queries[1]?.data?.data,
    vps: queries[2]?.data?.data,
    vrack: queries[3]?.data?.data,
    isError: queries.some((query) => query.isError),
    error: queries.find((query) => query.error),
    isLoading: queries.some((query) => query.isLoading),
  };
};
