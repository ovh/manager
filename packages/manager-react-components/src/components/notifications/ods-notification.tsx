import React from 'react';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import {
  Notification,
  NotificationType,
  useNotifications,
} from './useNotifications';

type OdsNotificationProps = {
  notification: Notification;
};

export const getOdsNotificationMessageColor = (type: NotificationType) => {
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

export const getOdsNotificationTextColor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.Success:
      return ODS_TEXT_COLOR_INTENT.success;
    case NotificationType.Error:
      return ODS_TEXT_COLOR_INTENT.error;
    case NotificationType.Warning:
      return ODS_TEXT_COLOR_INTENT.warning;
    case NotificationType.Info:
      return ODS_TEXT_COLOR_INTENT.info;
    default:
      return ODS_TEXT_COLOR_INTENT.info;
  }
};

export const OdsNotification: React.FC<OdsNotificationProps> = ({
  notification,
}) => {
  const { clearNotification } = useNotifications();
  return (
    <OsdsMessage
      className="mb-2"
      type={getOdsNotificationMessageColor(notification.type)}
      {...(notification.dismissable
        ? {
            removable: true,
            onOdsRemoveClick: () => clearNotification(notification.uid),
          }
        : {})}
    >
      <OsdsText
        color={getOdsNotificationTextColor(notification.type)}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {notification.content}
      </OsdsText>
    </OsdsMessage>
  );
};

export default OdsNotification;
