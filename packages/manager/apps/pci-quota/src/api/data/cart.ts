import { v6 } from '@ovh-ux/manager-core-api';

type TCheckout = {
  url: string;
};

const createCart = async (ovhSubsidiary: string): Promise<string> => {
  const { data } = await v6.post('/order/cart', {
    ovhSubsidiary,
  });

  return data.cartId;
};

const assignCart = async (cartId: string): Promise<string> => {
  await v6.post(`/order/cart/${cartId}/assign`);

  return cartId;
};

export const createAndAssignCart = async (ovhSubsidiary: string) => {
  const cartId = await createCart(ovhSubsidiary);
  return assignCart(cartId);
};

export const checkoutCart = async (cartId: string): Promise<TCheckout> => {
  const { data } = await v6.post<TCheckout>(`/order/cart/${cartId}/checkout`, {
    cartId,
    autoPayWithPreferredPaymentMethod: true,
  });

  return data;
};
