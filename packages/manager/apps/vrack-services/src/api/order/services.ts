import {
  Cart,
  Creation,
  Item,
  Order,
  OrderDetail,
  OrderStatus,
} from './order.type';
import { createFetchDataFn } from '../common';

export const postOrderCartQueryKey = ['post/order/cart'];

/**
 * Create a new OVH order cart
 */
export const postOrderCart = async (params: Creation) =>
  createFetchDataFn<Cart>({
    url: '/order/cart',
    params,
    apiVersion: 'v6',
    method: 'post',
  })();

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
) =>
  createFetchDataFn<undefined>({
    url: `/order/cart/${params.cartId}/assign`,
    params,
    apiVersion: 'v6',
    method: 'post',
  })();

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
export const postOrderCartCartIdVrack = async (
  params: PostOrderCartCartIdVrackParams,
) =>
  createFetchDataFn<Item>({
    url: `/order/cart/${params.cartId}/vrack`,
    params,
    apiVersion: 'v6',
    method: 'post',
  })();

export type PostOrderCartCartIdVrackServicesParams = {
  duration: string;
  planCode: string;
  pricingMode: string;
  quantity: number;
  cartId: string;
  zone: string;
  name?: string;
};

export const postOrderCartCartIdVrackServicesQueryKey = (
  params: PostOrderCartCartIdVrackServicesParams,
) => [`/order/cart/${params.cartId}/vrackServices`];

/**
 * Post a new vRack Services item in your cart
 */
export const postOrderCartCartIdVrackServices = async (
  params: PostOrderCartCartIdVrackServicesParams,
) =>
  createFetchDataFn<Item>({
    url: `/order/cart/${params.cartId}/vrackServices`,
    params,
    apiVersion: 'v6',
    method: 'post',
  })();

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
export const postOrderCartCartIdCheckout = async (
  params: PostOrderCartCartIdCheckoutParams,
) =>
  createFetchDataFn<Order>({
    url: `/order/cart/${params.cartId}/checkout`,
    params: { data: params },
    apiVersion: 'v6',
    method: 'post',
  })();

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
  return createFetchDataFn<number[]>({
    url: `/me/order${params.size > 0 ? `?${params.toString()}` : ''}`,
    method: 'get',
    apiVersion: 'v6',
  })();
};

/**
 * Get current status of order
 */
export const getOrderStatus = (orderId: number) =>
  createFetchDataFn<OrderStatus>({
    url: `/me/order/${orderId}/status`,
    apiVersion: 'v6',
    method: 'get',
  })();

/**
 * Get product list of order
 */
export const getOrderDetailsList = (orderId: number) =>
  createFetchDataFn<number[]>({
    url: `/me/order/${orderId}/details`,
    apiVersion: 'v6',
    method: 'get',
  })();

/**
 * Get details of order details
 */
export const getOrderDetails = ({
  orderId,
  detailId,
}: {
  orderId: number;
  detailId: number;
}) =>
  createFetchDataFn<OrderDetail>({
    url: `/me/order/${orderId}/details/${detailId}`,
    apiVersion: 'v6',
    method: 'get',
  })();
