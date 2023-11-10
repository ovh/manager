import { useQuery } from '@tanstack/react-query';
import {
  postOrderCart,
  postOrderCartCartIdAssign,
  postOrderCartCartIdVrack,
  postOrderCartCartIdVrackServices,
  postOrderCartCartIdCheckout,
  getOrderStatusQueryKey,
  getOrderStatus,
} from './services';
import { Creation } from './order.type';

export const useOrderPollingStatus = (
  orderId: string,
  pollingInterval = 5000,
) => {
  return useQuery({
    queryKey: getOrderStatusQueryKey(orderId),
    queryFn: getOrderStatus(orderId),
    refetchInterval: pollingInterval,
  });
};

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
  });

  return order;
};

export const orderVrackServicesQueryKey = ['/orderVrackServices'];

export const orderVrackServices = async (
  params: Creation & { displayName?: string; selectedZone: string },
) => {
  const {
    data: { cartId },
  } = await postOrderCart(params);
  await postOrderCartCartIdAssign({ cartId });
  const cart = await postOrderCartCartIdVrackServices({
    duration: 'P1M',
    planCode: 'vrackServices',
    pricingMode: 'default',
    quantity: 1,
    cartId,
    name: params.displayName,
    zone: params.selectedZone,
  });
  const order = await postOrderCartCartIdCheckout({
    cartId: cart.data.cartId,
    waiveRetractationPeriod: false,
  });

  return order;
};
