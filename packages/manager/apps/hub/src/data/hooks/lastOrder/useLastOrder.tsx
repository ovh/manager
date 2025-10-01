import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getLastOrder } from '@/data/api/order/order';
import { LastOrder } from '@/types/order.type';

export const useLastOrder = () =>
  useQuery<LastOrder, AxiosError>({
    queryKey: ['lastOrder'],
    queryFn: getLastOrder,
  });
