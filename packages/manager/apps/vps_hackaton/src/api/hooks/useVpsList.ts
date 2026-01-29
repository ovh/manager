import { useQuery } from '@tanstack/react-query';
import { vpsListQueryKey } from '@/adapters/tanstack/vps/vps.queryKey';
import { getVpsList } from '@/api/data/vps.api';
import type { TVpsList } from '@/domain/entities/vps';
import type { TSelectOptions } from './types';

export const useVpsList = <TData = TVpsList>({
  select,
}: TSelectOptions<TVpsList, TData> = {}) => {
  return useQuery({
    queryKey: vpsListQueryKey(),
    queryFn: getVpsList,
    select,
  });
};
