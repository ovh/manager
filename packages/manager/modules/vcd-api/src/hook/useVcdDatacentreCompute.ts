import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getVcdDatacentreCompute } from '../api';
import { VCDCompute } from '../types';
import { getVdcComputeQueryKey } from '../utils';

export const useVcdDatacentreCompute = (id: string, vdcId: string) => {
  return useQuery<VCDCompute[]>({
    queryKey: getVdcComputeQueryKey(vdcId),
    queryFn: () => getVcdDatacentreCompute(id, vdcId),
    retry: false,
    placeholderData: keepPreviousData,
  });
};
