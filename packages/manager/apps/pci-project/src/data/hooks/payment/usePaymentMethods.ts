import { useQuery } from '@tanstack/react-query';
import {
  getPaymentMethods,
  TPaymentMethodParams,
} from '@/data/api/payment/payment-method';

export const paymentMathodQueryKey = (params?: TPaymentMethodParams) => [
  'me',
  'payment',
  'method',
  Object.entries(params || {}),
];

export const usePaymentMethods = (params?: TPaymentMethodParams) => {
  return useQuery({
    queryKey: paymentMathodQueryKey(params),
    queryFn: () => getPaymentMethods(params),
  });
};
