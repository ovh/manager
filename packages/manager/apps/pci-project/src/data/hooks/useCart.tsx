import { ApiError } from '@ovh-ux/manager-core-api';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  addItemToCart,
  assignCart,
  attachConfigurationToCartItem,
  createCart,
  getCartSummary,
  getPublicCloudOptions,
  orderCloudProject,
  removeItemFromCart,
} from '@/data/api/cart';

import { PCI_HDS_ADDON, PCI_PROJECT_ORDER_CART } from '@/constants';
import {
  Cart,
  CartContract,
  OrderedProduct,
  PlanCode,
} from '@/data/types/cart.type';
import queryClient from '@/queryClient';

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

export type AddItemToCartParams = {
  cartId: string;
  item: {
    itemId: number;
    duration: string;
    planCode: string;
    pricingMode: string;
    quantity: number;
  };
};

export const useAddItemToCart = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: OrderedProduct) => void;
  onError?: (error: ApiError) => void;
} = {}) => {
  return useMutation<OrderedProduct, ApiError, AddItemToCartParams>({
    mutationFn: (params: AddItemToCartParams) =>
      addItemToCart(params.cartId, params.item),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: getCartSummaryQueryKey(variables.cartId),
      });
      if (onSuccess) {
        onSuccess(data);
      }
    },
    onError,
  });
};

export const useRemoveItemFromCart = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
} = {}) => {
  return useMutation({
    mutationFn: (params: { cartId: string; itemId: number }) =>
      removeItemFromCart(params.cartId, params.itemId),
    onSuccess: (_data, variables) => {
      // Invalidate the cart summary cache for this cart
      queryClient.invalidateQueries({
        queryKey: getCartSummaryQueryKey(variables.cartId),
      });
      if (onSuccess) {
        onSuccess();
      }
    },
    onError,
  });
};

/**
 * Mutation hook to attach a configuration to a cart item.
 *
 * @param {Object} [options] - Optional callbacks for mutation lifecycle.
 * @param {Function} [options.onSuccess] - Called after successful configuration attachment.
 * @param {Function} [options.onError] - Called if the mutation fails.
 *
 * @returns {UseMutationResult<void, ApiError, { cartId: string; itemId: number; payload: { label: string; value: string } }>}
 */
export const useAttachConfigurationToCartItem = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
} = {}) =>
  useMutation({
    mutationFn: ({
      cartId,
      itemId,
      payload,
    }: {
      cartId: string;
      itemId: number;
      payload: { label: string; value: string };
    }) => attachConfigurationToCartItem(cartId, itemId, payload),
    onSuccess: () => {
      if (onSuccess) {
        onSuccess();
      }
    },
    onError,
  });

/**
 * Mutation hook to create and assign a new cart for a given OVH subsidiary.
 *
 * @returns {UseMutationResult<Cart, ApiError, { ovhSubsidiary: OvhSubsidiary }>}
 *   - mutate({ ovhSubsidiary }) to create and assign a cart
 *   - On success, returns the created Cart object
 */
export const useCreateAndAssignCart = () =>
  useMutation({
    mutationFn: async ({ ovhSubsidiary }: { ovhSubsidiary: OvhSubsidiary }) => {
      const cart = await createCart(ovhSubsidiary);
      await assignCart(cart.cartId);
      return cart;
    },
  });

/**
 * Hook to get HDS addon options for a cart
 * Based on AngularJS orderCart.getHdsAddon implementation
 *
 * @param cartId - The cart ID
 * @returns {UseQueryResult<CartProductOption>}
 *   - Returns the HDS addon option if found
 */
export const useGetHdsAddonOption = (cartId?: string) =>
  useQuery({
    queryKey: ['cart-hds-addon-option', cartId],
    queryFn: async () =>
      getPublicCloudOptions(
        cartId as string,
        PCI_PROJECT_ORDER_CART.planCode as PlanCode,
      ),
    select: (cloudOptions) => {
      // Find HDS addon option based on planCode and family
      const hdsOption = cloudOptions?.find(
        (option) =>
          option.planCode === PCI_HDS_ADDON.planCode &&
          option.family === PCI_HDS_ADDON.family,
      );
      return hdsOption;
    },
    enabled: !!cartId,
  });

/**
 * Mutation hook to order a Public Cloud project item in the specified cart.
 *
 * @returns {UseMutationResult<OrderedProduct, Error, { cartId: string }>}
 *
 */
export const useOrderProjectItem = () =>
  useMutation({
    mutationFn: async ({ cartId }: { cartId: string }) => {
      const projectItem = await orderCloudProject(
        cartId,
        PCI_PROJECT_ORDER_CART.planCode as PlanCode,
      );
      return projectItem;
    },
  });
