import apiClient from '@ovh-ux/manager-core-api';
import { CreateRouting, NotificationRouting } from '../types/routing.type';

export const getNotificationRoutingListQueryKey = () => [
  '/notification/routing',
];
export const getNotificationRoutingQueryKey = (routingId: string) => [
  `/notification/routing/${routingId}`,
];
export const getNotificationRouting = async (
  routingId: string,
): Promise<NotificationRouting> => {
  const { data: responseData } = await apiClient.v2.get<NotificationRouting>(
    `/notification/routing/${routingId}`,
  );
  return responseData;
};

export const createRouting = async (data: CreateRouting) => {
  const { data: responseData } = await apiClient.v2.post(
    '/notification/routing',
    data,
  );
  return responseData;
};

export const deleteRouting = async (routingId: string) => {
  const { data: responseData } = await apiClient.v2.delete(
    `/notification/routing/${routingId}`,
  );
  return responseData;
};

export const updateRouting = async (routingId: string, data: CreateRouting) => {
  const { data: responseData } = await apiClient.v2.put(
    `/notification/routing/${routingId}`,
    data,
  );
  return responseData;
};
