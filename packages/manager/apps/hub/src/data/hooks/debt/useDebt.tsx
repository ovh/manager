import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getDebt } from '@/data/api/debt';
import { Debt } from '@/types/debt.type';

export const useFetchHubDebt = (options?: Partial<DefinedInitialDataOptions<Debt, AxiosError>>) =>
  useQuery<Debt, AxiosError>({
    ...options,
    queryKey: ['getHubDebt'],
    queryFn: () => getDebt(),
    retry: 0,
  });
