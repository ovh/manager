import { v6 } from '@ovh-ux/manager-core-api';
import { CartSummary } from '@/data/types/cart.type';

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
