import { useQuery, useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  attachCartIdToCart,
  attachConfigurationToCartItem,
  checkoutCart,
  orderCloudProject,
  createEmptyCart,
  getPublicCloudOptions,
  getCartSummary,
} from '@/data/api/cart';

import {
  Cart,
  PlanCode,
  CartContract,
  CartSummary,
} from '@/data/types/cart.type';

export const useCreateCart = (
  ovhSubsidiary: string,
  planCode: PlanCode,
  projectDescription: string,
) => {
  return useQuery<Cart>({
    queryKey: ['new-cart', planCode],
    queryFn: async () => {
      const cart = await createEmptyCart(ovhSubsidiary);
      const { cartId } = cart;

      // Attach cartId on cart (NOTE: Note sure why or if it's still needed)
      await attachCartIdToCart(cartId);

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

export type TUseFinalizeCartInterface = {
  onSuccess: (summary: CartSummary) => void;
  onError: (error: ApiError) => void;
};

export const useFinalizeCart = ({
  onError,
  onSuccess,
}: TUseFinalizeCartInterface) => {
  const mutation = useMutation({
    mutationFn: (cartId: string) => checkoutCart(cartId),
    onError,
    onSuccess: (summary: CartSummary) => onSuccess(summary),
  });
  return {
    finalizeCart: (cartId: string) => mutation.mutate(cartId),
    ...mutation,
  };
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
