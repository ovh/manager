import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { getVcdVrackNetwork } from '../api/vcd-vrack-network';
import { getVcdVrackNetworkQueryKey } from '../utils/queryKeys';

export const useVcdVrackNetworkOptions = (id: string, vdcId: string) => {
  return queryOptions({
    queryKey: getVcdVrackNetworkQueryKey(id, vdcId),
    queryFn: () => getVcdVrackNetwork(id, vdcId),
    placeholderData: keepPreviousData,
    select: (data) => data.data,
  });
};
