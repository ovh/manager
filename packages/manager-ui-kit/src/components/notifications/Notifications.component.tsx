import React, { useEffect, useState, FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Message, MESSAGE_COLOR } from '@ovhcloud/ods-react';
import { useNotifications } from './useNotifications';
import { NotificationType, Notification } from './Notifications.type';
import { NotificationProps } from './Notifications.props';

const NOTIFICATION_TYPE_MAP = {
  [NotificationType.Success]: MESSAGE_COLOR.success,
  [NotificationType.Error]: MESSAGE_COLOR.critical,
  [NotificationType.Warning]: MESSAGE_COLOR.warning,
  [NotificationType.Info]: MESSAGE_COLOR.information,
};

/**
 * This component display the list of notifications. It acts
 * as a "flash" component because by default once the notifications have been
 * shown they are cleared. It means that you can use this component on multiple
 * pages, switching page won't display notifications twice.
 *
 * It replicates the current behavior of public cloud notifications for
 * actions (success / errors / etc)
 */
export const Notifications: FC<NotificationProps> = ({
  clearAfterRead = true,
}) => {
  const location = useLocation();
  const [originLocation] = useState(location);
  const { notifications, clearNotifications, clearNotification } =
    useNotifications();

  useEffect(() => {
    if (clearAfterRead && originLocation.pathname !== location.pathname)
      clearNotifications();
  }, [clearAfterRead, location.pathname]);

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
