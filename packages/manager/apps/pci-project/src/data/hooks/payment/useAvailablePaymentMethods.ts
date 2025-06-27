import { useQuery } from '@tanstack/react-query';
import { getAvailablePaymentMethods } from '@/data/api/payment/payment-method';

export const availablePaymentMathodQueryKey = () => [
  'me',
  'payment',
  'availableMethods',
];

export const useAvailablePaymentMethods = () => {
  return useQuery({
    queryKey: availablePaymentMathodQueryKey(),
    queryFn: getAvailablePaymentMethods,
  });
};
