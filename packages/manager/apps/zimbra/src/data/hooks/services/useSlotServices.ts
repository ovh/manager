import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';

import { SlotService, getSlotServices, getSlotServicesQueryKey } from '@/data/api';

type Options = Omit<UseQueryOptions, 'queryKey' | 'queryFn'>;

export const useSlotServices = (options: Options = {}) => {
  return useQuery({
    ...options,
    queryKey: getSlotServicesQueryKey(),
    queryFn: () => getSlotServices(),
  }) as UseQueryResult<Record<string, SlotService>>;
};
