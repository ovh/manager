import { UseQueryOptions, useQueries, useQuery } from '@tanstack/react-query';
import {
  ApiError,
  ApiResponse,
  IcebergFetchResultV6,
} from '@ovh-ux/manager-core-api';
import { useState } from 'react';
import {
  DedicatedServerVmacType,
  getDedicatedServerVmacVirtualAddress,
  getdedicatedServerVmac,
  getdedicatedServerVmacQueryKey,
} from '@/data/api';
import { getDedicatedServerVmacVirtualAddressQueryKey } from '../../api';

export type UseGetIpVmacWithIpParams = {
  serviceName: string;
  enabled?: boolean;
};

export type VmacWithIpType = DedicatedServerVmacType & {
  ip: string[];
};

function arraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  const sortedArr1 = arr1.slice().sort();
  const sortedArr2 = arr2.slice().sort();

  return sortedArr1.reduce((acc, item, index) => {
    if (!acc) {
      return false;
    }
    return item === sortedArr2[index];
  }, true);
}

const INVALIDATED_REFRESH_PERIOD = 5000;

// Only for dedicated server for now
export const useGetIpVmacWithIp = ({
  serviceName,
  enabled = true,
}: UseGetIpVmacWithIpParams) => {
  const [isInvalidated, setIsInvalidated] = useState(false);
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
        setIsInvalidated(true);
        setInvalidatedData(macAdresses);
        return INVALIDATED_REFRESH_PERIOD;
      }

      if (!!invalidatedData && !arraysEqual(invalidatedData, macAdresses)) {
        setIsInvalidated(false);
        setInvalidatedData(undefined);
      }

      return isInvalidated ? INVALIDATED_REFRESH_PERIOD : undefined;
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
    isLoading: isLoading || !!results.find((result) => !!result.isLoading),
    isError: isError || !!results.find((result) => !!result.isError),
    vmacsWithIp: results?.map(({ data }, index) => ({
      ...dedicatedServerVmacResponse?.data?.[index],
      ip: data?.data,
    })) as VmacWithIpType[],
  };

  return formattedResult;
};
