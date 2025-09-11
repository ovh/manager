import {
  DefinedInitialDataOptions,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';
import { fetchTime } from '@/data/api/time';

export const useTime = (
  options: Partial<DefinedInitialDataOptions<number>> = {},
): UseQueryResult<number> =>
  useQuery({
    ...options,
    queryKey: ['time'],
    queryFn: fetchTime,
    refetchOnWindowFocus: false,
  });
