import React from 'react';
import { OsdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { Notification, NotificationType } from './useNotifications';

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
  return (
    <OsdsMessage className="mb-2" type={getOdsMessageColor(notification.type)}>
      {notification.content}
    </OsdsMessage>
  );
}

export default OdsNotification;
