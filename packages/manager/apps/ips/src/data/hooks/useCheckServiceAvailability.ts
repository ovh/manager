import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { ServiceType } from '@/types';
import {
  DedicatedServerServiceInfos,
  getDedicatedServerServiceInfos,
  VrackServiceInfos,
  getVrackServiceInfos,
  VpsServiceInfos,
  getVpsServiceInfos,
  DedicatedCloudServiceInfos,
  getDedicatedCloudServiceInfos,
  getDedicatedServerOrderableIp,
  OrderableIpResponse,
} from '../api';

export const useCheckServiceAvailability = ({
  serviceName,
  serviceType,
  onServiceUnavailable,
}: {
  serviceName?: string;
  serviceType?: ServiceType;
  onServiceUnavailable?: (serviceName?: string) => void;
}) => {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: [serviceType, serviceName, 'availability'],
    queryFn: async () => {
      try {
        let serviceInfos: ApiResponse<
          | DedicatedServerServiceInfos
          | VpsServiceInfos
          | VrackServiceInfos
          | DedicatedCloudServiceInfos
        > = null;
        let orderableIps: ApiResponse<OrderableIpResponse> = null;
        switch (serviceType) {
          case ServiceType.server:
            serviceInfos = await getDedicatedServerServiceInfos(serviceName);
            orderableIps = await getDedicatedServerOrderableIp(serviceName);
            if (orderableIps?.data?.ipv4.length === 0) {
              return {
                data: {
                  status: 'ip_quota_exceeded',
                },
              };
            }
            break;
          case ServiceType.vps:
            serviceInfos = await getVpsServiceInfos(serviceName);
            break;
          case ServiceType.vrack:
            serviceInfos = await getVrackServiceInfos(serviceName);
            break;
          case ServiceType.dedicatedCloud:
            serviceInfos = await getDedicatedCloudServiceInfos(serviceName);
            break;
          default:
            serviceInfos = null;
        }
        if (serviceInfos?.data?.status === 'expired') {
          onServiceUnavailable?.(serviceName);
        }
        return serviceInfos;
      } catch (err) {
        if ((err as ApiError)?.response?.status === 460) {
          onServiceUnavailable?.(serviceName);
        }
        throw err;
      }
    },
    enabled:
      !!serviceName &&
      [
        ServiceType.server,
        ServiceType.vrack,
        ServiceType.vps,
        ServiceType.dedicatedCloud,
      ].includes(serviceType),
    retry: false,
  });

  return {
    isServiceInfoLoading: isLoading,
    serviceStatus:
      serviceType === ServiceType.ipParking ? 'ok' : data?.data?.status,
    hasServiceInfoError: isError,
    serviceInfoError: error,
  };
};
