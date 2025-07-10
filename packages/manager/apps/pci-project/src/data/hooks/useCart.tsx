import { useQuery } from '@tanstack/react-query';
import {
  assignCart,
  attachConfigurationToCartItem,
  createCart,
  getCartSummary,
  getPublicCloudOptions,
  orderCloudProject,
} from '@/data/api/cart';

import { Cart, CartContract, PlanCode } from '@/data/types/cart.type';

export const useCreateCart = (
  ovhSubsidiary: string,
  planCode: PlanCode,
  projectDescription: string,
) => {
  return useQuery<Cart>({
    queryKey: ['new-cart', planCode],
    queryFn: async () => {
      const cart = await createCart(ovhSubsidiary);
      const { cartId } = cart;

      // Attach cartId on cart (NOTE: Note sure why or if it's still needed)
      await assignCart(cartId);

      // NOTE: I'm not sure this API call is useful either
      await getPublicCloudOptions(cartId, planCode);

      // Order in the cart the cloud product (with matching planCode & capacities)
      const orderedCloudProduct = await orderCloudProject(cartId, planCode);

      // Attach project description to cart
      await attachConfigurationToCartItem(cartId, orderedCloudProduct.itemId, {
        label: 'description',
        value: projectDescription,
      });

      return cart;
    },
  });
};

export const getContractAgreementsQueryKey = (cartId: string | null) => [
  'new-cart',
  cartId,
  'contract-agreements',
];

export const useContractAgreements = (cartId: string | null) => {
  return useQuery<CartContract[]>({
    enabled: !!cartId,
    queryKey: getContractAgreementsQueryKey(cartId),
    queryFn: async () => {
      // TODO: optimize with another (less costly) endpoint
      const summary = await getCartSummary(cartId || '');
      const contracts: CartContract[] = summary.contracts.map((d) => ({
        name: d.name,
        url: d.url,
      }));
      return contracts;
    },
  });
};

export const getCartSummaryQueryKey = (cartId?: string) => [
  `/order/cart/${cartId}/summary`,
];

export const useGetCartSummary = (cartId?: string) =>
  useQuery({
    queryKey: getCartSummaryQueryKey(cartId),
    queryFn: () => getCartSummary(cartId as string),
    enabled: !!cartId,
  });
