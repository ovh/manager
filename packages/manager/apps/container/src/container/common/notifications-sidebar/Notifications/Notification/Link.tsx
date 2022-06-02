import React from 'react';

import useNotifications from '@/core/notifications';

type Props = {
  children?: JSX.Element;
  notificationId?: string;
  url?: string;
};

const NotificationIcon = ({
  children = null,
  notificationId = '',
  url = '',
}: Props): JSX.Element => {
  const { toggleNotificationReadStatus } = useNotifications();

  const onNotificationLinkClick = (): Promise<unknown> => {
    return toggleNotificationReadStatus(notificationId, true);
  };

  return (
    <a href={url} onClick={onNotificationLinkClick}>
      {children}
    </a>
  );
};

export default NotificationIcon;
