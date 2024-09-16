import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getDebt } from '@/data/api/debt';
import { Debt } from '@/types/debt.type';

export const useFetchHubDebt = () =>
  useQuery<Debt, AxiosError>({
    queryKey: ['getHubDebt'],
    queryFn: () => getDebt(),
    retry: 0,
  });
