import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getVcdDatacentreCompute } from '../api';
import { RestrictedQueryOptions, VCDCompute } from '../types';
import { getVdcComputeQueryKey } from '../utils';

type UseVcdDatacentreComputeParams = {
  id: string;
  vdcId: string;
} & RestrictedQueryOptions<VCDCompute[]>;

export const useVcdDatacentreCompute = ({
  id,
  vdcId,
  ...options
}: UseVcdDatacentreComputeParams) => {
  return useQuery<VCDCompute[]>({
    queryKey: getVdcComputeQueryKey(vdcId),
    queryFn: () => getVcdDatacentreCompute(id, vdcId),
    retry: false,
    placeholderData: keepPreviousData,
    ...options,
  });
};
