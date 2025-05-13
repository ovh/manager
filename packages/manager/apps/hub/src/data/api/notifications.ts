import { aapi } from '@ovh-ux/manager-core-api';
import i18next from 'i18next';
import { ApiEnvelope } from '@/types/apiEnvelope.type';
import { Notification, NotificationsList } from '@/types/notifications.type';

const hubNotificationStatuses = ['warning', 'error'];

export const getNotifications: () => Promise<Notification[]> = async () => {
  const { data } = await aapi.get<ApiEnvelope<NotificationsList>>(
    `/hub/notifications`,
    {
      headers: {
        'Content-Language': i18next.language.replace('-', '_'),
      },
    },
  );
  return (
    data.data?.notifications.data || []
  ).filter((notification: Notification) =>
    hubNotificationStatuses.includes(notification.level),
  );
};
