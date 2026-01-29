import { useQuery } from '@tanstack/react-query';
import { vpsDetailQueryKey } from '@/adapters/tanstack/vps/vps.queryKey';
import { getVpsDetail } from '@/api/data/vps.api';
import type { TVps } from '@/domain/entities/vps';
import type { TSelectOptions } from './types';

export const useVpsDetail = <TData = TVps>(
  serviceName: string,
  { select }: TSelectOptions<TVps, TData> = {},
) => {
  return useQuery({
    queryKey: vpsDetailQueryKey(serviceName),
    queryFn: () => getVpsDetail(serviceName),
    select,
    enabled: !!serviceName,
  });
};
