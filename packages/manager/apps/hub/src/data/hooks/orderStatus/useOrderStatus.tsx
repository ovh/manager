import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getOrderStatus } from '@/data/api/order/order';
import { OrderStatus } from '@/types/order.type';

export const useOrderStatus = (orderId: number) => {
  return useQuery<OrderStatus, AxiosError>({
    queryKey: ['orderStatus', orderId],
    queryFn: () => getOrderStatus(orderId),
    enabled: !!orderId,
  });
};
