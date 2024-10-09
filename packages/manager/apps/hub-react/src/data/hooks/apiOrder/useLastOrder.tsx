import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { LastOrderTrackingResponse } from '@/types/order.type';
import { fetchOrder } from '@/data/api/apiOrder/apiOrder';

export const useFetchLastOrder = () =>
  useQuery<LastOrderTrackingResponse, AxiosError>({
    queryKey: ['get-last-order'],
    queryFn: fetchOrder,
  });
