import React, { FC, useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { MESSAGE_COLOR, Message } from '@ovhcloud/ods-react';

import { Notification, NotificationProps, NotificationType } from './Notifications.props';
import { useNotifications } from './useNotifications';

const NOTIFICATION_TYPE_MAP = {
  [NotificationType.Success]: MESSAGE_COLOR.success,
  [NotificationType.Error]: MESSAGE_COLOR.critical,
  [NotificationType.Warning]: MESSAGE_COLOR.warning,
  [NotificationType.Info]: MESSAGE_COLOR.information,
};

export const Notifications: FC<NotificationProps> = ({ clearAfterRead = true }) => {
  const location = useLocation();
  const [originLocation] = useState(location);
  const { notifications, clearNotifications, clearNotification } = useNotifications();

  useEffect(() => {
    if (clearAfterRead && originLocation.pathname !== location.pathname) clearNotifications();
  }, [clearAfterRead, location.pathname, clearNotifications, originLocation.pathname]);

  return (
    <>
      {notifications.map((notification: Notification) => (
        <Message
          key={notification.uid}
          className="mb-2 w-full"
          color={NOTIFICATION_TYPE_MAP[notification.type]}
          onRemove={() => clearNotification(notification.uid)}
          dismissible={notification.dismissible ?? true}
        >
          {notification.content}
        </Message>
      ))}
    </>
  );
};

export default Notifications;
