import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ServiceType, ipParkingOptionValue } from '@/types';
import { GetServiceList, getServiceList } from '../api';

/**
 * Fetch the list of available services to order an additional IP
 */
export const useServiceList = () => {
  const { data, ...query } = useQuery<GetServiceList, ApiError>({
    queryKey: ['serviceList', 'order'],
    queryFn: getServiceList,
  });

  return {
    getServiceType: (serviceId: string) => {
      if (serviceId === ipParkingOptionValue) {
        return ServiceType.ipParking;
      }
      if (data?.dedicatedCloud?.some(({ name }) => name === serviceId)) {
        return ServiceType.dedicatedCloud;
      }
      if (data?.server?.some(({ name }) => name === serviceId)) {
        return ServiceType.server;
      }
      if (data?.vps?.some(({ name }) => name === serviceId)) {
        return ServiceType.vps;
      }
      return data?.vrack?.some(({ name }) => name === serviceId)
        ? ServiceType.vrack
        : ServiceType.unknown;
    },
    ...data,
    ...query,
  };
};
