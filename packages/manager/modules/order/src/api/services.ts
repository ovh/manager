import { apiClient } from '@ovh-ux/manager-core-api';
import {
  Cart,
  Creation,
  Item,
  Order,
  OrderDetail,
  OrderStatus,
  OrderData,
  ConfigurationItem,
} from './order.type';

export const postOrderCartQueryKey = ['post/order/cart'];

/**
 * Create a new OVH order cart
 */
export const postOrderCart = async (params: Creation) =>
  apiClient.v6.post<Cart>('/order/cart', params);

export type PostOrderCartCartIdAssignParams = {
  cartId?: string;
};

export const postOrderCartCartIdAssignQueryKey = (
  params: PostOrderCartCartIdAssignParams,
) => [`/order/cart/${params.cartId}/assign`];

/**
 * Assign a shopping cart to a loggedin client
 */
export const postOrderCartCartIdAssign = async (
  params: PostOrderCartCartIdAssignParams,
) => apiClient.v6.post<null>(`/order/cart/${params.cartId}/assign`, params);

export type PostOrderCartCartIdVrackParams = {
  duration: string;
  planCode: string;
  pricingMode: string;
  quantity: number;
  cartId: string;
};

export const postOrderCartCartIdVrackQueryKey = (
  params: PostOrderCartCartIdVrackParams,
) => [`/order/cart/${params.cartId}/vrack`];

/**
 * Post a new vRack item in your cart
 */
export const postOrderCartCartIdVrack = async ({
  cartId,
  ...params
}: PostOrderCartCartIdVrackParams) =>
  apiClient.v6.post<Item>(`/order/cart/${cartId}/vrack`, params);

export type PostOrderCartCartIdVrackServicesParams = {
  duration: string;
  planCode: string;
  pricingMode: string;
  quantity: number;
  cartId: string;
};

export const postOrderCartCartIdVrackServicesQueryKey = (
  params: PostOrderCartCartIdVrackServicesParams,
) => [`/order/cart/${params.cartId}/vrackServices`];

/**
 * Post a new vRack Services item in your cart
 */
export const postOrderCartCartIdVrackServices = async ({
  cartId,
  ...params
}: PostOrderCartCartIdVrackServicesParams) =>
  apiClient.v6.post<Item>(`/order/cart/${cartId}/vrackServices`, params);

export type PostOrderCartCartIdCheckoutParams = {
  cartId: string;
  /**
   * Indicates that order will be automatically paid with preferred payment method
   */
  autoPayWithPreferredPaymentMethod?: boolean;
  /**
   * Indicates that order will be processed with waiving retractation period
   */
  waiveRetractationPeriod?: boolean;
};

export const postOrderCartCartIdCheckoutQueryKey = (
  params: PostOrderCartCartIdCheckoutParams,
) => [`/order/cart/${params.cartId}/checkout`];

/**
 * Validate your shopping and create order
 */
export const postOrderCartCartIdCheckout = async ({
  cartId,
  ...data
}: PostOrderCartCartIdCheckoutParams) =>
  apiClient.v6.post<Order>(`/order/cart/${cartId}/checkout`, data);

export const postConfigureCartItem = async ({
  cartId,
  itemId,
  ...data
}: {
  cartId: string;
  itemId: number;
  label: string;
  value: string;
}) =>
  apiClient.v6.post<ConfigurationItem>(
    `/order/cart/${cartId}/item/${itemId}/configuration`,
    data,
  );

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
    params.size > 0 ? `/me/order?${params.toString()}` : '/me/order',
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
export const getOrderDetails = ({
  orderId,
  detailId,
}: {
  orderId: number;
  detailId: number;
}) => apiClient.v6.get<OrderDetail>(`/me/order/${orderId}/details/${detailId}`);
