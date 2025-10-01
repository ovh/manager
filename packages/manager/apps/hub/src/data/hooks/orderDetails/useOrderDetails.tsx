import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getOrderDetails } from '@/data/api/order/order';
import { OrderDetail } from '@/types/order.type';

export const useOrderDetails = (orderId: number) => {
  return useQuery<Array<OrderDetail>, AxiosError>({
    queryKey: ['orderDetails', orderId],
    queryFn: () => getOrderDetails(orderId),
    enabled: !!orderId,
  });
};
