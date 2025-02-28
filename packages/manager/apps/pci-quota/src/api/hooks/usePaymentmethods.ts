import { useQuery } from '@tanstack/react-query';
import { getValidPaymenthMethodids } from '@/api/data/payment-method';

export const useGetValidPaymentMethodIds = () => {
  const query = useQuery({
    queryKey: ['me', 'payment', 'methods', 'valid'],
    queryFn: () => getValidPaymenthMethodids(),
  });

  return {
    ...query,
    isValid: Array.isArray(query.data) && query.data.length !== 0,
  };
};
