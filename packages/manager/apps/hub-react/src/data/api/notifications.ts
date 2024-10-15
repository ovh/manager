import { aapi } from '@ovh-ux/manager-core-api';
import { ApiEnvelope } from '@/types/apiEnvelope.type';
import { Notification, NotificationsList } from '@/types/notifications.type';

const hubNotificationStatuses = ['warning', 'error'];

export const getNotifications: () => Promise<Notification[]> = async () => {
  const { data } = await aapi.get<ApiEnvelope<NotificationsList>>(
    `/hub/notifications`,
  );
  return (
    data.data?.notifications.data || []
  ).filter((notification: Notification) =>
    hubNotificationStatuses.includes(notification.level),
  );
};
