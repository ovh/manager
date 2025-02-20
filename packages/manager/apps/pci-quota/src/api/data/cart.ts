import { v6 } from '@ovh-ux/manager-core-api';

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

export const checkoutCart = async (cartId: string) => {
  await v6.post(`/order/cart/${cartId}/checkout`, {
    cartId,
    autoPayWithPreferredPaymentMethod: true,
  });
};
