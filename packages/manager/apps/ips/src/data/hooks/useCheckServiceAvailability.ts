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
} from '../api';

export const useCheckServiceAvailability = ({
  serviceName,
  serviceType,
  onServiceExpired,
}: {
  serviceName?: string;
  serviceType?: ServiceType;
  onServiceExpired?: (serviceName?: string) => void;
}) => {
  const { isLoading, data, isError, error } = useQuery({
    queryKey: [serviceType, serviceName, 'serviceInfos'],
    queryFn: async () => {
      try {
        let serviceInfos: ApiResponse<
          | DedicatedServerServiceInfos
          | VpsServiceInfos
          | VrackServiceInfos
          | DedicatedCloudServiceInfos
        > = null;
        switch (serviceType) {
          case ServiceType.server:
            serviceInfos = await getDedicatedServerServiceInfos(serviceName);
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
          onServiceExpired?.(serviceName);
        }
        return serviceInfos;
      } catch (err) {
        if ((err as ApiError)?.response?.status === 460) {
          onServiceExpired?.(serviceName);
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
