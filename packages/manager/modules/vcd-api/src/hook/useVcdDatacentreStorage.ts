import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getVcdDatacentreStorage } from '../api';
import { RestrictedQueryOptions, VCDStorage } from '../types';
import { getVdcStorageQueryKey } from '../utils';

type UseVcdDatacentreStorageParams = {
  id: string;
  vdcId: string;
} & RestrictedQueryOptions<VCDStorage[]>;

export const useVcdDatacentreStorage = ({
  id,
  vdcId,
  ...options
}: UseVcdDatacentreStorageParams) => {
  return useQuery<VCDStorage[]>({
    queryKey: getVdcStorageQueryKey(vdcId),
    queryFn: () => getVcdDatacentreStorage(id, vdcId),
    retry: false,
    placeholderData: keepPreviousData,
    ...options,
  });
};
