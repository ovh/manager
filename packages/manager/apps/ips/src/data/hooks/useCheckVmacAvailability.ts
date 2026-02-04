import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useState } from 'react';
import {
  DedicatedServerNetworkSpecifications,
  getDedicatedServerNetworkSpecifications,
  getDedicatedServerVmac,
} from '../api';

export const useCheckVmacAvailability = ({
  serviceName,
  checkVmacAvailabilityCallback,
}: {
  serviceName: string;
  checkVmacAvailabilityCallback?: (
    serviceName: string,
    isVmacSupported: boolean,
  ) => void;
}) => {
  const [isVmacAvailable, setIsVmacAvailable] = useState<
    Record<string, boolean>
  >({});

  const { isLoading, data, isError, error } = useQuery({
    queryKey: ['SERVER', serviceName, 'VMAC'],
    queryFn: async () => {
      try {
        let networkInfo: ApiResponse<DedicatedServerNetworkSpecifications> = null;
        networkInfo = await getDedicatedServerNetworkSpecifications(
          serviceName,
        );

        if (networkInfo?.data?.vmac.supported) {
          const vmacs = await getDedicatedServerVmac(serviceName);
          const canAddVmac =
            vmacs.data?.length <= networkInfo?.data?.vmac.quota;
          setIsVmacAvailable((prev) => ({
            ...prev,
            [serviceName]: canAddVmac,
          }));
          checkVmacAvailabilityCallback?.(serviceName, canAddVmac);
        } else {
          setIsVmacAvailable((prev) => ({
            ...prev,
            [serviceName]: false,
          }));
          checkVmacAvailabilityCallback?.(serviceName, false);
        }
        return networkInfo;
      } catch (err) {
        if ((err as ApiError)?.response?.status === 460) {
          checkVmacAvailabilityCallback?.(serviceName, false);
        }
        throw err;
      }
    },
    enabled: !!serviceName,
    retry: false,
  });

  return {
    isLoading,
    isVmacAvailable,
    hasServiceInfoError: isError,
    serviceInfoError: error,
  };
};
