import { ApiResponse, v6 } from '@ovh-ux/manager-core-api';
import { Cart, CartItem, Order } from '@ovh-ux/manager-module-order';

export const createCart = (ovhSubsidiary: string): Promise<ApiResponse<Cart>> =>
  v6.post('/order/cart', {
    ovhSubsidiary,
  });

export const assignCart = (cartId: string): Promise<ApiResponse<void>> =>
  v6.post(`/order/cart/${cartId}/assign`);

export const addVrackBandwidthToCart = ({
  cartId,
  serviceName,
  planCode,
  duration = 'P1M',
  quantity = 1,
  pricingMode = 'default',
}: {
  cartId: string;
  serviceName: string;
  planCode: string;
  duration?: string;
  quantity?: number;
  pricingMode?: string;
}): Promise<ApiResponse<CartItem>> =>
  v6.post(`/order/cartServiceOption/vrack/${serviceName}`, {
    cartId,
    planCode,
    duration,
    quantity,
    pricingMode,
  });

export const checkoutCart = (cartId: string): Promise<ApiResponse<Order>> =>
  v6.post(`/order/cart/${cartId}/checkout`, {
    autoPayWithPreferredPaymentMethod: true,
  });
