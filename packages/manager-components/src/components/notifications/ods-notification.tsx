import React from 'react';
import { OsdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import {
  Notification,
  NotificationType,
  useNotifications,
} from './useNotifications';

type OdsNotificationProps = {
  notification: Notification;
};

const getOdsMessageColor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.Success:
      return ODS_MESSAGE_TYPE.success;
    case NotificationType.Error:
      return ODS_MESSAGE_TYPE.error;
    case NotificationType.Warning:
      return ODS_MESSAGE_TYPE.warning;
    case NotificationType.Info:
      return ODS_MESSAGE_TYPE.info;
    default:
      return ODS_MESSAGE_TYPE.info;
  }
};

export function OdsNotification({ notification }: OdsNotificationProps) {
  const { clearNotification } = useNotifications();
  return (
    <OsdsMessage
      className="mb-2"
      type={getOdsMessageColor(notification.type)}
      {...(notification.dismissable
        ? {
            removable: true,
            onOdsRemoveClick: () => clearNotification(notification.uid),
          }
        : {})}
    >
      {notification.content}
    </OsdsMessage>
  );
}

export default OdsNotification;
