import {
  postOrderCart,
  postOrderCartCartIdAssign,
  postOrderCartCartIdVrack,
  postOrderCartCartIdVrackServices,
  postOrderCartCartIdCheckout,
  postConfigureCartItem,
} from './services';
import { Creation } from './order.type';

export * from './order.type';

export * from './hook';

export const orderVrackQueryKey = ['/orderVrack'];

export const orderVrack = async (params: Creation) => {
  const {
    data: { cartId },
  } = await postOrderCart(params);
  await postOrderCartCartIdAssign({ cartId });
  const cart = await postOrderCartCartIdVrack({
    duration: 'P1M',
    planCode: 'vrack',
    pricingMode: 'default',
    quantity: 1,
    cartId,
  });
  const order = await postOrderCartCartIdCheckout({
    cartId: cart.data.cartId,
    waiveRetractationPeriod: false,
    autoPayWithPreferredPaymentMethod: false,
  });

  return order;
};

export const orderVrackServicesQueryKey = ['/orderVrackServices'];

export const orderVrackServices = async (
  params: Creation & { displayName?: string; selectedRegion: string },
) => {
  const {
    data: { cartId },
  } = await postOrderCart({ ovhSubsidiary: params.ovhSubsidiary });
  await postOrderCartCartIdAssign({ cartId });
  const cart = await postOrderCartCartIdVrackServices({
    duration: 'P1M',
    planCode: 'vrack-services',
    pricingMode: 'default',
    quantity: 1,
    cartId,
  });
  await postConfigureCartItem({
    cartId,
    itemId: cart.data.itemId,
    label: 'region',
    value: params.selectedRegion,
  });
  if (params.displayName) {
    await postConfigureCartItem({
      cartId,
      itemId: cart.data.itemId,
      label: 'displayName',
      value: params.displayName,
    });
  }
  const order = await postOrderCartCartIdCheckout({
    cartId: cart.data.cartId,
    waiveRetractationPeriod: false,
    autoPayWithPreferredPaymentMethod: false,
  });

  return order;
};
