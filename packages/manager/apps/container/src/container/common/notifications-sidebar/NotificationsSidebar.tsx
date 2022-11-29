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
      return groupBy([] as NotificationType[]);
    }

    const allDates = [...new Set(notifications.map(({ date }) => date))];

    const groups: NotificationGroup[] = await Promise.all(
      allDates.map(async (date) => {
        const dateFromNow = await fromNow(date, locale);
        return { date, fromNow: dateFromNow };
      }),
    );
    const dateGroups = groups.reduce(
      (
        all: Record<string, NotificationGroup>,
        { date, fromNow: dateFromNow },
      ) => {
        return {
          ...all,
          [date]: dateFromNow,
        };
      },
      {},
    );

    return groupBy(notifications, ({ date }) => dateGroups[date]);
  };

  useEffect(() => {
    const updateNotifications = async () => {
      setGroupedNotifications(await getGroupedNotifications());
    };
    updateNotifications();
  }, [notifications]);

  return (
    <div
      className={`${
        style.notificationsSidebar
      } ${isNotificationsSidebarVisible && style.notificationsSidebar_toggle}`}
      role="menu"
    >
      <Notifications>
        <>
          {isNotificationsLoading && <Notifications.Loading />}
          {!isNotificationsLoading && (
            <>
              {!notifications.length ? (
                <Notifications.Empty />
              ) : (
                <>
                  {Object.keys(groupedNotifications).map(
                    (groupTime: string, index) => (
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
