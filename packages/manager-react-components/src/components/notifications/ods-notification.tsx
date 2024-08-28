import React from 'react';
import { OdsMessage } from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
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
      return ODS_MESSAGE_COLOR.success;
    case NotificationType.Error:
      return ODS_MESSAGE_COLOR.danger;
    case NotificationType.Warning:
      return ODS_MESSAGE_COLOR.warning;
    case NotificationType.Info:
      return ODS_MESSAGE_COLOR.information;
    default:
      return ODS_MESSAGE_COLOR.information;
  }
};

export const OdsNotification: React.FC<OdsNotificationProps> = ({
  notification,
}) => {
  const { clearNotification } = useNotifications();
  return (
    <OdsMessage
      className="mb-2 w-full"
      color={getOdsMessageColor(notification.type)}
      onOdsRemove={() => clearNotification(notification.uid)}
    >
      {notification.content}
    </OdsMessage>
  );
};

export default OdsNotification;
