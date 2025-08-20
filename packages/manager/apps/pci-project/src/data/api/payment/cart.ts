import { v6 } from '@ovh-ux/manager-core-api';
import {
  TCart,
  TCartOptionPayload,
  TCartProductOption,
} from '@/data/types/payment/cart.type';

export const getPublicCloudOptions = async (
  cartId: string,
  planCode: string,
): Promise<TCartProductOption[]> => {
  const { data } = await v6.get<TCartProductOption[]>(
    `order/cart/${cartId}/cloud/options?planCode=${planCode}`,
  );
  return data;
};

export const addCartCreditOption = async (
  cartId: string,
  options: TCartOptionPayload,
): Promise<TCart> => {
  const { data } = await v6.post(`order/cart/${cartId}/cloud/options`, {
    ...options,
  });
  return data;
};
