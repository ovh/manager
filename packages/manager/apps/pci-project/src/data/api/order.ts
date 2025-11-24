import { v6 } from '@ovh-ux/manager-core-api';
import {
  TOrderDetail,
  TOrderFollowUp,
  TOrderDetailExtension,
} from '@/data/types/order.type';

export const getOrderFollowUp = async (
  orderId: number,
): Promise<TOrderFollowUp[]> => {
  const { data } = await v6.get(`/me/order/${orderId}/followUp`);
  return data;
};

export const getOrderDetails = async (orderId: number): Promise<number[]> => {
  const { data } = await v6.get(`/me/order/${orderId}/details`);
  return data;
};

export const getOrderDetailWithExtension = async (
  orderId: number,
  orderDetailId: number,
): Promise<TOrderDetail & { extension: TOrderDetailExtension }> => {
  const { data: orderDetail } = await v6.get(
    `/me/order/${orderId}/details/${orderDetailId}`,
  );

  const { data: orderDetailExtension } = await v6.get(
    `/me/order/${orderId}/details/${orderDetailId}/extension`,
  );

  return {
    ...orderDetail,
    extension: orderDetailExtension,
  };
};
