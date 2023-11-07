import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@ovh-ux/manager-react-core-application';
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

export * from './order.type';

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

export const orderVrack = (params: Creation) => {
  const executeOrder = async () => {
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
  return queryClient.fetchQuery(orderVrackQueryKey, executeOrder);
};

export const orderVrackServicesQueryKey = ['/orderVrackServices'];

export const orderVrackServices = (
  params: Creation & { displayName?: string; selectedZone: string },
) => {
  const executeOrder = async () => {
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
  return queryClient.fetchQuery(orderVrackServicesQueryKey, executeOrder);
};
