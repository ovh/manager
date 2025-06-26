import { v6 } from '@ovh-ux/manager-core-api';
import {
  AddOptionToCartResponse,
  Cart,
  CartSummary,
  TCheckoutResponse,
} from '@/data/types/cart.type';

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
  await v6.post(`/order/cart/${cartId}/assign`);
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

export const checkoutCart = async (
  cartId: string,
): Promise<TCheckoutResponse> => {
  const { data } = await v6.post<TCheckoutResponse>(
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
