import { useQuery } from '@tanstack/react-query';
import { getCartSummary } from '@/data/api/cart';

export const getCartSummaryQueryKey = (cartId?: string) => [
  `/order/cart/${cartId}/summary`,
];

export const useGetCartSummary = (cartId?: string) =>
  useQuery({
    queryKey: getCartSummaryQueryKey(cartId),
    queryFn: () => getCartSummary(cartId as string),
    enabled: !!cartId,
  });
