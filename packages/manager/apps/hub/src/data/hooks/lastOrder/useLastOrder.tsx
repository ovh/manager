import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getLastOrder } from '@/data/api/lastOrder';
import { LastOrder } from '@/types/lastOrder.type';

export const useFetchHubLastOrder = () =>
  useQuery<LastOrder, AxiosError>({
    queryKey: ['getHubLastOrder'],
    queryFn: getLastOrder,
    retry: 0,
  });
