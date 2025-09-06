import { apiClient } from '@ovh-ux/manager-core-api';

import { Cart, ConfigurationItem, Contract, Item, Order } from './order.type';

export type PostOrderCartCartIdCheckoutParams = {
  cartId: string;
  /**
   * Indicates that order will be automatically paid with preferred payment method
   */
  autoPayWithPreferredPaymentMethod?: boolean;
  /**
   * Indicates that order will be processed with waiving retractation period
   */
  waiveRetractationPeriod?: boolean;
};

/**
 * Validate your shopping and create order
 */
export const postOrderCartCartIdCheckout = async ({
  cartId,
  ...data
}: PostOrderCartCartIdCheckoutParams) =>
  apiClient.v6.post<Order>(`/order/cart/${cartId}/checkout`, data);

export const postConfigureCartItem = async ({
  cartId,
  itemId,
  ...data
}: {
  cartId: string;
  itemId: number;
  label: string;
  value: string;
}) =>
  apiClient.v6.post<ConfigurationItem>(`/order/cart/${cartId}/item/${itemId}/configuration`, data);

export type CartItem = {
  itemEndpoint: string;
  options?: unknown;
  configurations?: { label: string; value: string }[];
};

export type CreateCartParams = {
  ovhSubsidiary: string;
  items: CartItem[];
};

export type CreateCartResult = {
  contractList: Contract[];
  cartId: string;
};

export const createCart = async ({
  ovhSubsidiary,
  items,
}: CreateCartParams): Promise<CreateCartResult> => {
  const { data } = await apiClient.v6.post<Cart>('/order/cart', {
    ovhSubsidiary,
  });

  await Promise.all(
    items.map(async ({ itemEndpoint, options, configurations }) => {
      const itemResponse = await apiClient.v6.post<Item>(
        `/order/cart/${data?.cartId}/${itemEndpoint}`,
        options,
      );

      if (configurations) {
        await Promise.all(
          configurations.map(({ label, value }) =>
            postConfigureCartItem({
              cartId: data?.cartId,
              itemId: itemResponse.data.itemId,
              label,
              value,
            }),
          ),
        );
      }
    }),
  );

  await apiClient.v6.post<null>(`/order/cart/${data.cartId}/assign`, {
    cartId: data?.cartId,
  });

  const orderContractsQuery = await apiClient.v6.get<Order>(`/order/cart/${data?.cartId}/checkout`);
  return {
    cartId: data?.cartId,
    contractList: orderContractsQuery.data.contracts,
  };
};
