import { ApiError, aapi, v6 } from '@ovh-ux/manager-core-api';

import { ApiEnvelope } from '@/types/apiEnvelope.type';
import {
  LastOrderResponse,
  Order,
  OrderDetailsResponse,
  OrderFollowUpResponse,
  OrderHistory,
  OrderStatus,
} from '@/types/order.type';

import { NOT_PAID, WAITING_PAYMENT_LABEL } from './order.constants';

export const getLastOrder = async (): Promise<ApiEnvelope<Order>> => {
  const { data } = await aapi.get<LastOrderResponse>('/hub/lastOrder');
  return data.data.lastOrder;
};

export const getOrderDetails = async (orderId: number): Promise<OrderDetailsResponse> => {
  const { data } = await v6.get<OrderDetailsResponse>(`/me/order/${orderId}/details`);
  return data;
};

export const getOrderStatus = async (orderId: number): Promise<OrderStatus> => {
  const { data } = await v6.get<OrderStatus>(`/me/order/${orderId}/status`);
  return data;
};

export const getOrderFollowUp = async (orderId: number): Promise<OrderFollowUpResponse> => {
  const { data } = await v6.get<OrderFollowUpResponse>(`/me/order/${orderId}/followUp`);
  return data;
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
  } catch (error) {
    const apiError = error as ApiError;
    if (apiError.response?.status === 404) {
      return [];
    }
    throw error;
  }
};
