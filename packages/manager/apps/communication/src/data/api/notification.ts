import apiClient from '@ovh-ux/manager-core-api';
import { NotificationReference } from '../types/reference.type';
import { Notification, NotificationAttachmentDetail } from '../types/notification.type';

export const getNotificationReference = async (): Promise<NotificationReference> => {
  const { data } = await apiClient.v2.get('/notification/reference');
  return data;
};

export const getNotification = async (
  notificationId: string,
): Promise<Notification> => {
  const { data } = await apiClient.v2.get(
    `/notification/history/${notificationId}`,
  );
  return data;
};

export async function fetchAttachmentUrl(
  notificationId: string,
  attachmentName: string,
): Promise<NotificationAttachmentDetail> {
  const { data } = await apiClient.v2.get<NotificationAttachmentDetail>(
    `/notification/history/${encodeURIComponent(notificationId)}/attachment/${encodeURIComponent(attachmentName)}`,
  );
  return data;
}
