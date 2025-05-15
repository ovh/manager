import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import {
  getSlotServices,
  getSlotServicesQueryKey,
  SlotService,
} from '@/data/api';

type Options = Omit<UseQueryOptions, 'queryKey' | 'queryFn'>;

export const useSlotServices = (options: Options = {}) => {
  return useQuery({
    ...options,
    queryKey: getSlotServicesQueryKey(),
    queryFn: () => getSlotServices(),
  }) as UseQueryResult<Record<string, SlotService>>;
};
