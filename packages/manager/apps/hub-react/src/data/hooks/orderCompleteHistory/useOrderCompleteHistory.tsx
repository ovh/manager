import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getCompleteHistory } from '@/data/api/order/order';
import { OrderHistory } from '@/types/order.type';

export const useOrderCompleteHistory = (
  orderId: number,
  orderStatus: string,
  orderDate: string,
) => {
  return useQuery<Array<OrderHistory>, AxiosError>({
    queryKey: ['orderCompleteHistory', orderId, orderStatus, orderDate],
    queryFn: () => getCompleteHistory(orderId, orderStatus, orderDate),
    enabled: !!orderId && !!orderStatus && !!orderDate,
  });
};
