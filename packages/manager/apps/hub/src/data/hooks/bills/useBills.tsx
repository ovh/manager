import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getBills } from '@/data/api/bills';
import { Bills } from '@/types/bills.type';

export const useFetchHubBills = (
  period: number,
  options?: Partial<DefinedInitialDataOptions<Bills, AxiosError>>,
) =>
  useQuery<Bills, AxiosError>({
    ...options,
    queryKey: ['getHubBills', period],
    queryFn: () => getBills(period),
    retry: 0,
  });
