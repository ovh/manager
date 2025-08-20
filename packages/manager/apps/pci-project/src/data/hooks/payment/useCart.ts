import { useQuery } from '@tanstack/react-query';
import { CREDIT_ORDER_CART } from '@/payment/constants';
import { getPublicCloudOptions } from '@/data/api/payment/cart';

export const useGetCreditAddonOption = (cartId?: string) =>
  useQuery({
    queryKey: [
      `order/cart/${cartId}/cloud/options?planCode=${CREDIT_ORDER_CART.projectPlanCode}`,
    ],
    queryFn: async () =>
      getPublicCloudOptions(
        cartId as string,
        CREDIT_ORDER_CART.projectPlanCode,
      ),
    select: (cloudOptions) => {
      // Find credit addon option based on planCode and family
      const creditOption = cloudOptions?.find(
        (option) => option.planCode === CREDIT_ORDER_CART.planCode,
      );
      return creditOption;
    },
    enabled: !!cartId,
  });
