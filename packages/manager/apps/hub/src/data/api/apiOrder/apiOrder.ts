import { aapi, v6 } from '@ovh-ux/manager-core-api';
import {
  OrderFollowUpResponse,
  OrderResponseData,
  OrderDetailsResponse,
  OrderStatus,
  OrderHistory,
  LastOrderTrackingResponse,
} from '@/types/order.type';
import { NOT_PAID, WAITING_PAYMENT_LABEL } from './apiOrder.constants';

export const getLastOrder: () => Promise<OrderResponseData> = async () =>
  aapi.get('/hub/lastOrder').then(({ data }) => {
    return data.data.lastOrder;
  });

export const getOrderDetails = async (
  orderId: number,
): Promise<OrderDetailsResponse> => {
  const { data } = await v6.get(`/me/order/${orderId}/details`);
  return data as OrderDetailsResponse;
};

export const getOrderStatus = async (orderId: number): Promise<OrderStatus> => {
  const { data } = await v6.get(`/me/order/${orderId}/status`);
  return data as OrderStatus;
};

export const getOrderFollowUp = async (
  orderId: number,
): Promise<OrderFollowUpResponse> => {
  const { data } = await v6.get(`/me/order/${orderId}/followUp`);
  return data as OrderFollowUpResponse;
};

export const getCompleteHistory = async (
  orderId: number,
  orderStatus: string,
  orderDate: string,
): Promise<OrderHistory[]> => {
  try {
    const followUp = await getOrderFollowUp(orderId);
    const history = followUp.flatMap((follow) => follow.history).reverse();

    if (orderStatus === NOT_PAID && history.length === 0) {
      history.push({
        date: orderDate,
        label: WAITING_PAYMENT_LABEL,
        description: undefined,
      });
    }

    return history;
  } catch (err) {
    if (err.response?.status === 404) {
      return [];
    }
    throw err;
  }
};

export const fetchOrder = async (): Promise<LastOrderTrackingResponse> => {
  const lastOrderResponse = await getLastOrder();

  if (!lastOrderResponse || lastOrderResponse.status !== 'OK') return undefined;

  const { data: lastOrder } = lastOrderResponse;
  const [orderStatus, details] = await Promise.all([
    getOrderStatus(lastOrder.orderId),
    getOrderDetails(lastOrder.orderId),
  ]);

  const histories = await getCompleteHistory(
    lastOrder.orderId,
    lastOrder.date,
    orderStatus,
  );

  return {
    ...details,
    status: orderStatus,
    history: histories,
    ...lastOrder,
  };
};
