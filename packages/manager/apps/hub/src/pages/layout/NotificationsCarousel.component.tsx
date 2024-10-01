import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OsdsIcon,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useFetchHubNotifications } from '@/data/hooks/notifications/useNotifications';
import { Notification, NotificationType } from '@/types/notifications.type';

const getMessageColor = (type: NotificationType) => {
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

const getMessageType = (type: NotificationType) => {
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

const getTextColor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.Success:
      return ODS_THEME_COLOR_INTENT.success;
    case NotificationType.Error:
      return ODS_THEME_COLOR_INTENT.error;
    case NotificationType.Warning:
      return ODS_THEME_COLOR_INTENT.warning;
    case NotificationType.Info:
      return ODS_THEME_COLOR_INTENT.info;
    default:
      return ODS_THEME_COLOR_INTENT.info;
  }
};

export default function NotificationsCarousel() {
  const { t } = useTranslation();
  const { trackClick } = useOvhTracking();
  const { data: notifications } = useFetchHubNotifications();
  const [currentIndex, setIndex] = useState(0);

  const showNextNotification = () => {
    setIndex((previousIndex) => (previousIndex + 1) % notifications.length);
    trackClick({
      actionType: 'action',
      actions: ['hub', 'dashboard', 'alert', 'action'],
    });
  };

  return (
    <>
      {notifications?.length > 0 && (
        <OsdsMessage
          className={`rounded ${notifications?.length > 1 ? '!pb-8' : ''}`}
          role="alert"
          color={getMessageColor(notifications[currentIndex].level)}
          type={getMessageType(notifications[currentIndex].level)}
          data-testid="notifications_carousel"
        >
          <OsdsText
            data-testid="notification_content"
            color={getMessageColor(notifications[currentIndex].level)}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._500}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: notifications[currentIndex].description,
              }}
            ></span>
          </OsdsText>
          {notifications?.length > 1 && (
            <>
              <OsdsIcon
                data-testid="next-notification-button"
                className="absolute top-1/2 right-4 -mt-6 cursor-pointer"
                name={ODS_ICON_NAME.ARROW_RIGHT}
                size={ODS_ICON_SIZE.sm}
                color={ODS_THEME_COLOR_INTENT.primary}
                onClick={showNextNotification}
              />
              <div
                className="absolute block w-full text-center right-0 left-0 bottom-1"
                data-testid="notification-navigation"
              >
                {notifications.map((val: Notification, index: number) => (
                  <OsdsIcon
                    className={`inline-block cursor-pointer ${
                      index > 0 ? 'ml-2' : ''
                    }`}
                    name={ODS_ICON_NAME.SHAPE_DOT}
                    size={ODS_ICON_SIZE.xxs}
                    color={getTextColor(notifications[currentIndex].level)}
                    contrasted={currentIndex === index || undefined}
                    onClick={() => setIndex((previousIndex) => index)}
                  />
                ))}
              </div>
            </>
          )}
        </OsdsMessage>
      )}
    </>
  );
}
