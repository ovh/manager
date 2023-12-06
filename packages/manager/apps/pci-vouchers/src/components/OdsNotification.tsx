import { OsdsMessage } from '@ovhcloud/ods-components/message/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components/message';
import { Notification, NotificationType } from '@/hooks/useNotifications';

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
    <OsdsMessage type={getOdsMessageColor(notification.type)}>
      {notification.content}
    </OsdsMessage>
  );
}

export default OdsNotification;
