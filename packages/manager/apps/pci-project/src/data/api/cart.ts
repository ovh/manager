import { v6 } from '@ovh-ux/manager-core-api';
import { AxiosError } from 'axios';

import {
  AddOptionToCartResponse,
  Cart,
  CartConfiguration,
  CartProduct,
  CartProductOption,
  CartSummary,
  OrderedProduct,
  PlanCode,
} from '@/data/types/cart.type';

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
  itemId: number,
  payload: { label: string; value: unknown },
): Promise<CartConfiguration> => {
  const { data } = await v6.post(
    `order/cart/${cartId}/item/${itemId}/configuration`,
    payload,
  );

  return data;
};

export const deleteConfigurationItemFromCart = async (
  cartId: string,
  itemId: number,
  configurationId: number,
) => {
  await v6.delete(
    `order/cart/${cartId}/item/${itemId}/configuration/${configurationId}`,
  );
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

/**
 * Retrieves the details of a specific cart by its ID.
 *
 * @param cartId - The unique identifier of the cart to retrieve.
 * @returns {Promise<Cart>} A promise that resolves to the cart details.
 */
export const getCart = async (cartId: string): Promise<Cart> => {
  const { data } = await v6.get<Cart>(`/order/cart/${cartId}`);

  return data;
};

/**
 * Creates a new order cart depending on the given OVH subsidiary.
 *
 * @param ovhSubsidiary - The OVH subsidiary code
 * @returns {Promise<Cart>}
 */
export const createCart = async (ovhSubsidiary: string): Promise<Cart> => {
  const { data } = await v6.post<Cart>('/order/cart', {
    ovhSubsidiary,
  });

  return data;
};

/**
 * Assigns the specified cart to the current user.
 *
 * @param cartId
 * @returns {Promise<void>} The assigned cart's ID as a string.
 */
export const assignCart = async (cartId: string): Promise<void> => {
  await v6.post(`/order/cart/${cartId}/assign`, { cartId });
};

/**
 * Adds an item to the specified cart.
 *
 * @param cartId - The unique identifier of the cart to which the item will be added.
 * @param item - The item details, including itemId, duration, planCode, pricingMode, and quantity.
 * @returns {Promise<AddItemToCartResponse>}
 */
export const addItemToCart = async (
  cartId: string,
  item: {
    itemId: number;
    duration: string;
    planCode: string;
    pricingMode: string;
    quantity: number;
  },
): Promise<OrderedProduct> => {
  const { data } = await v6.post<Promise<OrderedProduct>>(
    `/order/cart/${cartId}/cloud/options`,
    { ...item },
  );

  return data;
};

export const removeItemFromCart = async (cartId: string, itemId: number) => {
  await v6.delete(`/order/cart/${cartId}/item/${itemId}`);
};

export const checkoutCart = async (cartId: string): Promise<CartSummary> => {
  const { data } = await v6.post<CartSummary>(
    `/order/cart/${cartId}/checkout`,
    {
      cartId,
    },
  );

  return data;
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

/**
 * Adds an option (service option) to the cart for a given project.
 *
 * @param projectId
 * @param options - The option details, including cartId, duration, planCode, pricingMode, and quantity.
 * @returns {Promise<AddOptionToCartResponse>}
 */
export const addOptionToCart = async (
  projectId: string,
  options: {
    cartId: string;
    duration: string;
    planCode: string;
    pricingMode: string;
    quantity: number;
  },
): Promise<AddOptionToCartResponse> => {
  const { data } = await v6.post<Promise<AddOptionToCartResponse>>(
    `/order/cartServiceOption/cloud/${projectId}`,
    {
      ...options,
    },
  );

  return data;
};
