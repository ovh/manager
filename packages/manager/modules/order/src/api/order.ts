import { apiClient } from '@ovh-ux/manager-core-api';

import { OrderData, OrderDetail, OrderStatus } from './order.type';

export const getOrderList = ({
  dateFrom,
  dateTo,
}: {
  dateFrom?: Date;
  dateTo?: Date;
} = {}) => {
  const params = new URLSearchParams();
  if (dateFrom) {
    params.append('date.from', dateFrom.toISOString());
  }
  if (dateTo) {
    params.append('date.to', dateTo.toISOString());
  }
  return apiClient.v6.get<number[]>(
    dateFrom || dateTo ? `/me/order?${params.toString()}` : '/me/order',
  );
};

export const getOrderData = (orderId: number) =>
  apiClient.v6.get<OrderData>(`/me/order/${orderId}`);

/**
 * Get current status of order
 */
export const getOrderStatus = (orderId: number) =>
  apiClient.v6.get<OrderStatus>(`/me/order/${orderId}/status`);

/**
 * Get product list of order
 */
export const getOrderDetailsList = (orderId: number) =>
  apiClient.v6.get<number[]>(`/me/order/${orderId}/details`);

/**
 * Get details of order details
 */
export const getOrderDetails = ({ orderId, detailId }: { orderId: number; detailId: number }) =>
  apiClient.v6.get<OrderDetail>(`/me/order/${orderId}/details/${detailId}`);
