import apiClient from '@ovh-ux/manager-core-api';
import { NotificationReference } from '../types/reference.type';

export const getNotificationReference = async (): Promise<NotificationReference> => {
  const { data } = await apiClient.v2.get('/notification/reference');
  return data;
};
