import React, { useEffect, useState } from 'react';

import { Environment } from '@ovh-ux/manager-config';
import { groupBy } from 'lodash-es';

import { MAX_NOTIFICATIONS } from './constants';
import Notifications from './Notifications/Notifications';
import style from './notifications-sidebar.module.scss';

import { useHeader } from '@/context/header';
import useNotifications, { Notification } from '@/core/notifications';
import useDate from '@/helpers/useDate';

type NotificationByDate = Record<string, Notification[]>;

type Props = {
  environment?: Environment;
};

const NotificationsSidebar = ({
  environment = {} as Environment,
}: Props): JSX.Element => {
  const locale = environment.getUserLocale();
  const { fromNow } = useDate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [groupedNotifications, setGroupedNotifications] = useState<
    NotificationByDate
  >({});

  const { isNotificationsSidebarVisible } = useHeader();
  const {
    notifications,
    loadNotifications,
    setNotificationsCount,
    getActiveNotifications,
  } = useNotifications();

  const getGroupedNotifications = async (
    notificationToDisplay: Notification[],
  ): Promise<NotificationByDate> => {
    if (!notificationToDisplay) {
      return groupBy([] as Notification[]);
    }

    const allDates = [
      ...new Set(notificationToDisplay.map(({ date }) => date)),
    ];
    interface Group {
      date: string;
      fromNow: string;
    }

    const groups: Group[] = await Promise.all(
      allDates.map(async (date) => {
        const dateFromNow = await fromNow(date, locale);
        return { date, fromNow: dateFromNow };
      }),
    );
    const dateGroups = groups.reduce(
      (all: Record<string, Group>, { date, fromNow: dateFromNow }) => {
        return {
          ...all,
          [date]: dateFromNow,
        };
      },
      {},
    );

    return groupBy(notificationToDisplay, ({ date }) => dateGroups[date]);
  };

  useEffect(() => {
    setIsLoading(true);
    loadNotifications().finally(() => {
      setIsLoading(false);
    });
  }, [locale]);

  useEffect(() => {
    const notificationToDisplay =
      notifications.length > MAX_NOTIFICATIONS
        ? notifications.slice(0, MAX_NOTIFICATIONS)
        : notifications;

    if (notificationToDisplay.length === 0) {
      setNotificationsCount(0);
      setGroupedNotifications({});
    } else {
      const updateNotifications = async () => {
        setNotificationsCount(
          getActiveNotifications(notificationToDisplay).length,
        );
        setGroupedNotifications(
          await getGroupedNotifications(notificationToDisplay),
        );
      };
      updateNotifications();
    }
  }, [notifications]);

  let notificationsContent;
  if (isLoading) {
    notificationsContent = <Notifications.Loading />;
  } else if (notifications.length === 0) {
    notificationsContent = <Notifications.Empty />;
  } else {
    notificationsContent = (
      <>
        {Object.keys(groupedNotifications).map((groupTime: string, index) => (
          <Notifications.Group
            notifications={groupedNotifications[groupTime]}
            title={groupTime}
            key={index}
          />
        ))}
      </>
    );
  }

  return (
    <div
      className={`${
        style.notificationsSidebar
      } ${isNotificationsSidebarVisible && style.notificationsSidebar_toggle}`}
      role="menu"
    >
      <Notifications>{notificationsContent}</Notifications>
    </div>
  );
};

export default NotificationsSidebar;
