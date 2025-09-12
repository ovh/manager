import { v6 } from '@ovh-ux/manager-core-api';
import { TOrderFollowUp } from '@/data/types/order.type';

export const getOrderFollowUp = async (
  orderId: number,
): Promise<TOrderFollowUp[]> => {
  const { data } = await v6.get(`/me/order/${orderId}/followUp`);
  return data;
};
