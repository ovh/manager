import apiClient from '@ovh-ux/manager-core-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import {
  Cart,
  Creation,
  Item,
  Order,
  OrderStatus,
  ResponseData,
} from './order.type';

export const createFetchDataFn = <T>({
  params,
  apiVersion,
  method,
  url,
}: {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  apiVersion: keyof typeof apiClient;
  params?: unknown;
}) => async () => {
  const response: ResponseData<T> = await apiClient[apiVersion][method](
    url,
    params,
  );

  if (response?.code?.startsWith('ERR')) {
    const error = new Error(response.response.data.message);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    error.stack = response.response;
    throw error;
  }

  return response;
};

export const postOrderCartQueryKey = ['post/order/cart'];

/**
 * Create a new OVH order cart
 */
export const postOrderCart = async (params: Creation) =>
  queryClient.fetchQuery(
    postOrderCartQueryKey,
    createFetchDataFn<Cart>({
      url: '/order/cart',
      params,
      apiVersion: 'v6',
      method: 'post',
    }),
  );

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
  queryClient.fetchQuery(
    postOrderCartCartIdAssignQueryKey(params),
    createFetchDataFn<undefined>({
      url: `/order/cart/${params.cartId}/assign`,
      params,
      apiVersion: 'v6',
      method: 'post',
    }),
  );

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
  queryClient.fetchQuery(
    postOrderCartCartIdVrackQueryKey(params),
    createFetchDataFn<Item>({
      url: `/order/cart/${params.cartId}/vrack`,
      params,
      apiVersion: 'v6',
      method: 'post',
    }),
  );

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
  queryClient.fetchQuery(
    postOrderCartCartIdVrackServicesQueryKey(params),
    createFetchDataFn<Item>({
      url: `/order/cart/${params.cartId}/vrackServices`,
      params,
      apiVersion: 'v6',
      method: 'post',
    }),
  );

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
  queryClient.fetchQuery(
    postOrderCartCartIdCheckoutQueryKey(params),
    createFetchDataFn<Order>({
      url: `/order/cart/${params.cartId}/checkout`,
      params: { data: params },
      apiVersion: 'v6',
      method: 'post',
    }),
  );

export const getOrderStatusQueryKey = (orderId: string) => [
  `get/me/order/${orderId}/status`,
];

/**
 * Get current status of order
 */
export const getOrderStatus = (orderId: string) => async (): Promise<
  OrderStatus
> =>
  queryClient.fetchQuery(
    getOrderStatusQueryKey(orderId),
    createFetchDataFn<OrderStatus>({
      url: `/me/order/${orderId}/status`,
      apiVersion: 'v6',
      method: 'get',
    }),
  );
