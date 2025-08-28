import { UseQueryOptions, useQueries, useQuery } from '@tanstack/react-query';
import {
  ApiError,
  ApiResponse,
  IcebergFetchResultV6,
} from '@ovh-ux/manager-core-api';
import { useState } from 'react';
import { hasSameStringElements } from '@ovh-ux/manager-core-utils';
import {
  DedicatedServerVmacType,
  getDedicatedServerVmacVirtualAddress,
  getdedicatedServerVmac,
  getdedicatedServerVmacQueryKey,
} from '@/data/api';
import { INVALIDATED_REFRESH_PERIOD } from '@/utils';
import { getDedicatedServerVmacVirtualAddressQueryKey } from '../../api';

export type UseGetIpVmacWithIpParams = {
  serviceName: string;
  enabled?: boolean;
};

export type VmacWithIpType = DedicatedServerVmacType & {
  ip: string[];
};

// Only for dedicated server for now
export const useGetIpVmacWithIp = ({
  serviceName,
  enabled = true,
}: UseGetIpVmacWithIpParams) => {
  const [invalidatedData, setInvalidatedData] = useState(undefined);

  const { data: dedicatedServerVmacResponse, isLoading, isError } = useQuery<
    IcebergFetchResultV6<DedicatedServerVmacType>,
    ApiError
  >({
    queryKey: getdedicatedServerVmacQueryKey({ serviceName }),
    queryFn: () => getdedicatedServerVmac({ serviceName }),
    enabled,
    retry: false,
    refetchInterval: (query) => {
      const queryData = query.state.data?.data ?? [];
      const macAdresses = queryData.map(({ macAddress }) => macAddress);

      if (query.state.isInvalidated) {
        setInvalidatedData(macAdresses);
        return INVALIDATED_REFRESH_PERIOD;
      }

      if (
        !!invalidatedData &&
        !hasSameStringElements(invalidatedData, macAdresses)
      ) {
        setInvalidatedData(undefined);
      }

      return invalidatedData ? INVALIDATED_REFRESH_PERIOD : undefined;
    },
  });

  const results = useQueries({
    queries: (dedicatedServerVmacResponse?.data || []).map(
      (vmac): UseQueryOptions<ApiResponse<string[]>, ApiError> => ({
        queryKey: getDedicatedServerVmacVirtualAddressQueryKey({
          serviceName,
          macAddress: vmac.macAddress,
        }),
        queryFn: () =>
          getDedicatedServerVmacVirtualAddress({
            serviceName,
            macAddress: vmac.macAddress,
          }),
        enabled: !!dedicatedServerVmacResponse?.data?.length,
      }),
    ),
  });

  const formattedResult = {
    isLoading:
      isLoading ||
      !!results.find((result) => !!result.isLoading || !!invalidatedData),
    isError: isError || !!results.find((result) => !!result.isError),
    vmacsWithIp: results?.map(({ data }, index) => ({
      ...dedicatedServerVmacResponse?.data?.[index],
      ip: data?.data,
    })) as VmacWithIpType[],
  };

  return formattedResult;
};
