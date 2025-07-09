import { AxiosError } from 'axios';
import { v6 } from '@ovh-ux/manager-core-api';

import {
  Cart,
  PlanCode,
  CartProduct,
  OrderedProduct,
  CartSummary,
  PaymentMean,
  CartProductOption,
} from '@/data/types/cart.type';

export const createEmptyCart = async (ovhSubsidiary: string): Promise<Cart> => {
  const { data } = await v6.post<Cart>('order/cart', { ovhSubsidiary });
  return data;
};

export const attachCartIdToCart = async (cartId: string) => {
  await v6.post(`order/cart/${cartId}/assign`, { cartId });
};

export const getPublicCloudOptions = async (
  cartId: string,
  planCode: PlanCode,
) => {
  const { data } = await v6.get<CartProductOption[]>(
    `order/cart/${cartId}/cloud/options?planCode=${planCode}`,
  );
  return data;
};

export const attachConfigurationToCartItem = async (
  cartId: string,
  itemId: string,
  payload: { label: string; value: unknown },
) => {
  await v6.post(`order/cart/${cartId}/item/${itemId}/configuration`, payload);
};

export const orderCloudProject = async (
  cartId: string,
  planCode: PlanCode,
): Promise<OrderedProduct> => {
  // Fetch list of product offers, throw if the cloud product offer is missing.
  const { data: productOffers } = await v6.get<CartProduct[]>(
    `order/cart/${cartId}/cloud`,
  );
  const cloudProjectOffer = productOffers.find((d) => d.planCode === planCode);
  if (!cloudProjectOffer) {
    throw new AxiosError(`planCode ${planCode} not found`);
  }

  // Find the correct offer & pricing (matching planCode & capacities = 'renew')
  const renewPrice = cloudProjectOffer.prices.find((price) =>
    price.capacities.includes('renew'),
  );
  if (!renewPrice) {
    throw new AxiosError(`could not find 'renew' price in product offer.`);
  }
  const { duration, pricingMode } = renewPrice;

  // Now that we have the right order information, order the product
  const { data: orderedProduct } = await v6.post<OrderedProduct>(
    `order/cart/${cartId}/cloud`,
    {
      duration,
      planCode,
      pricingMode,
      quantity: 1,
    },
  );

  return orderedProduct;
};

export const checkoutCart = async (cartId: string): Promise<CartSummary> => {
  const { data: summary } = await v6.post<CartSummary>(
    `order/cart/${cartId}/checkout`,
  );
  if (summary.prices.withTax.value === 0) {
    await v6.post(`me/order/${summary.orderId}/payWithRegisteredPaymentMean`, {
      paymentMean: PaymentMean.FIDELITY_ACCOUNT,
    });
  }
  return summary;
};

/**
 * Retrieves the summary of a specified cart.
 *
 * @param cartId
 * @returns {Promise<CartSummary>} The cart summary, including details, prices, and contracts.
 */
export const getCartSummary = async (cartId: string): Promise<CartSummary> => {
  const { data } = await v6.get<CartSummary>(`/order/cart/${cartId}/summary`);

  return data;
};
