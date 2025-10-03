import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getServerTime } from '@/data/api/utilsApi';

export const useFetchServerTime = () =>
  useQuery<number, AxiosError>({
    queryKey: ['getServerTime'],
    queryFn: getServerTime,
    retry: 1,
  });
