import apiClient from '@ovh-ux/manager-core-api';
import { NotificationRouting } from '../types/routing.type';

export const getNotificationRoutingQueryKey = () => ['/notification/routing'];
export const getNotificationRouting = async (): Promise<NotificationRouting[]> => {
  const { data } = await apiClient.v2.get('/notification/routing');
  return data;
};
