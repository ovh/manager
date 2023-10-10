import { useQuery, useQueryClient } from '@tanstack/react-query';
import { aapi, v6 } from '@ovh-ux/manager-core-api';

import { useApplication } from '@/context';
import transformNotification, {
  APINotification,
  Notification,
} from './notification';
import { MAX_NOTIFICATIONS, NOTIFICATION_STATUS_ENUM } from './constants';

const useNotifications = () => {
  const { environment } = useApplication();
  const queryClient = useQueryClient();

  const getNotifications = async (): Promise<Notification[]> => {
    try {
      const apiNotifications = await aapi.get('/notification', {
        params: {
          target: environment.getRegion(),
          lang: environment.getUserLocale(),
        },
      }).then(({ data }) => data);

      const newNotifications: APINotification[] = [];
      apiNotifications.forEach((notif: APINotification) => {
        newNotifications.push({
          ...notif,
          urlDetails: {
            href: notif.urlDetails ? notif.urlDetails.href : '',
          },
        });
      });

      return newNotifications
        .map(transformNotification)
        .slice(0, MAX_NOTIFICATIONS);
    } catch (error) {
      return [];
    }
  };

  const { data: notifications, isLoading: isNotificationsLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications(),
    refetchInterval: 60 * 60 * 1000,
  });

  const getNotificationById = (notificationId: string): Notification => {
    return notifications.find(({ id }) => id === notificationId);
  };

  // UPDATE NOTIFICATIONS

  const updateNotications = (status: unknown): Promise<unknown> => {
    return aapi.post('/notification', status).then(({ data }) => data);
  };

  const updateNotificationReadStatus = (
    notification: Notification,
    status: string,
  ): Promise<unknown> => {
    notification.setUpdating(true);

    return updateNotications({
      [status]: [notification.id],
    })
      .then(() => {
        notification.setStatus(status);
        queryClient.invalidateQueries({queryKey: ['notifications']});
      })
      .finally(() => {
        notification.setUpdating(false);
      });
  };

  const readAllNotifications = async () => {
    await updateNotications({
      [NOTIFICATION_STATUS_ENUM.ACKNOWLEDGED]: notifications
        .filter(({ updating, isActive }) => !updating && isActive())
        .map(({ id }) => id),
    });
    queryClient.invalidateQueries({queryKey: ['notifications']});
  };

  const toggleNotificationReadStatus = (
    notificationId: string,
    linkClicked = false,
  ): Promise<unknown> => {
    const notificationToUpdate = getNotificationById(notificationId);

    if (notificationToUpdate.isActive() && !notificationToUpdate.updating) {
      // mark as read
      return updateNotificationReadStatus(
        notificationToUpdate,
        NOTIFICATION_STATUS_ENUM.ACKNOWLEDGED,
      );
    }
    if (
      !notificationToUpdate.isActive() &&
      !notificationToUpdate.updating &&
      !linkClicked
    ) {
      // mark as unread
      return updateNotificationReadStatus(
        notificationToUpdate,
        NOTIFICATION_STATUS_ENUM.ACTIVE,
      );
    }

    return Promise.resolve();
  };

  return {
    notifications,
    isNotificationsLoading,
    readAllNotifications,
    toggleNotificationReadStatus,
  };
};

export default useNotifications;
