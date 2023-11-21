import React, { useEffect, useState } from 'react';
import { groupBy } from 'lodash-es';

import { useApplication } from '@/context';
import { useHeader } from '@/context/header';
import useNotifications, {
  Notification as NotificationType,
} from '@/core/notifications';
import { fromNow } from '@/helpers/dateHelper';

import Notifications from './Notifications/Notifications';
import style from './notifications-sidebar.module.scss';

interface NotificationGroup {
  date: string;
  fromNow: string;
}

type NotificationByDate = Record<string, NotificationType[]>;

const NotificationsSidebar = () => {
  const { isNotificationsSidebarVisible } = useHeader();
  const { notifications, isNotificationsLoading } = useNotifications();
  const [groupedNotifications, setGroupedNotifications] = useState<
    NotificationByDate
  >({});
  const locale = useApplication().environment.getUserLocale();

  const getGroupedNotifications = async (): Promise<NotificationByDate> => {
    if (!notifications) {
      return {};
    }

    const allDates = [...new Set((notifications as NotificationType[])?.map(({ date }) => date) || [])];

    const groups: NotificationGroup[] = await Promise.all(
      allDates.map(async (date: string) => {
        const dateFromNow = await fromNow(date, locale);
        return { date, fromNow: dateFromNow };
      }),
    );

    const dateGroups: NotificationByDate = groups.reduce(
      (all: NotificationByDate, { date }: NotificationGroup) => {
        const group = (notifications as NotificationType[]).filter((notification) => notification.date === date);
        return {
          ...all,
          [date]: group,
        };
      },
      {},
    );

    return dateGroups;
  };

  useEffect(() => {
    const updateNotifications = async () => {
      setGroupedNotifications(await getGroupedNotifications());
    };
    updateNotifications();
  }, [notifications]);

  return (
    <div
      className={`${style.notificationsSidebar
        } ${isNotificationsSidebarVisible && style.notificationsSidebar_toggle}`}
    >
      <Notifications>
        <>
          {isNotificationsLoading && <Notifications.Loading />}
          {!isNotificationsLoading && (
            <>
              {!Array.isArray(notifications) || !notifications.length ? (
                <Notifications.Empty />
              ) : (
                <>
                  {Object.keys(groupedNotifications).map((groupTime: string, index) => (
                    <Notifications.Group
                      notifications={groupedNotifications[groupTime]}
                      title={groupTime}
                      key={index}
                    />
                  ),
                  )}
                </>
              )}
            </>
          )}
        </>
      </Notifications>
    </div>
  );
};

export default NotificationsSidebar;
