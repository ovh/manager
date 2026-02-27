import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  DedicatedServerNetworkSpecifications,
  getDedicatedServerNetworkSpecifications,
  getDedicatedServerVmac,
} from '../api';

export type UseCheckVmacAvailabilityData = {
  vmacs: string[];
  canAddVmac: boolean;
} & DedicatedServerNetworkSpecifications['vmac'];

export const useCheckVmacAvailability = ({
  serviceName,
  enabled = true,
}: {
  serviceName?: string;
  enabled?: boolean;
}) =>
  useQuery<UseCheckVmacAvailabilityData, ApiError>({
    queryKey: ['getDedicatedServerNetworkSpecifications', serviceName],
    queryFn: async () => {
      try {
        let vmacs: string[] = [];
        const networkInfo = await getDedicatedServerNetworkSpecifications(
          serviceName,
        );

        if (networkInfo?.data?.vmac.supported) {
          const vmacsQuery = await getDedicatedServerVmac(serviceName);
          vmacs = vmacsQuery.data || [];
        }

        return {
          ...networkInfo?.data.vmac,
          vmacs,
          canAddVmac: vmacs.length < networkInfo?.data?.vmac?.quota,
        };
      } catch (err) {
        if ((err as ApiError)?.response?.status === 460) {
          return {
            supported: false,
            quota: 0,
            vmacs: [],
            canAddVmac: false,
          };
        }
        throw err;
      }
    },
    enabled: enabled && !!serviceName,
    retry: false,
  });
