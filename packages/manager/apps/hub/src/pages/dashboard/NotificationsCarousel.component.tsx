import { useState } from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SKELETON_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsIcon,
  OsdsLink,
  OsdsMessage,
  OsdsSkeleton,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';

import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { useFetchHubNotifications } from '@/data/hooks/notifications/useNotifications';
import useGuideUtils from '@/hooks/guides/useGuideUtils';
import { useHubContext } from '@/pages/dashboard/context';
import { NOTIFICATIONS_LINKS } from '@/pages/dashboard/dashboard.constants';
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
  const { t } = useTranslation('hub/notifications');
  const { trackClick } = useOvhTracking();
  const { isLoading, isFreshCustomer } = useHubContext();
  const { data: notifications, isLoading: areNotificationsLoading } = useFetchHubNotifications({
    enabled: !(isLoading || isFreshCustomer),
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const notificationsLinks = useGuideUtils(NOTIFICATIONS_LINKS);

  const showNextNotification = () => {
    setCurrentIndex((previousIndex) => (previousIndex + 1) % notifications.length);
    trackClick({
      actionType: 'action',
      actions: ['hub', 'dashboard', 'alert', 'action'],
    });
  };

  const notificationLink =
    notifications?.[currentIndex] && notificationsLinks[notifications[currentIndex].id];

  return isLoading || areNotificationsLoading ? (
    <OsdsTile className="p-6">
      <OsdsSkeleton inline size={ODS_SKELETON_SIZE.sm} />
      <OsdsSkeleton />
    </OsdsTile>
  ) : (
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
            <Trans
              t={t}
              i18nKey={`${notifications[currentIndex].id}_description`}
              components={{
                anchor: (
                  <OsdsLink
                    href={notificationLink}
                    color={ODS_THEME_COLOR_INTENT.primary}
                    target={OdsHTMLAnchorElementTarget._blank}
                  ></OsdsLink>
                ),
              }}
            ></Trans>
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
                {notifications.map((notification: Notification, index: number) => (
                  <OsdsIcon
                    key={`notification_selector_${notification.id}`}
                    className={`inline-block cursor-pointer ${index > 0 ? 'ml-2' : ''}`}
                    name={ODS_ICON_NAME.SHAPE_DOT}
                    size={ODS_ICON_SIZE.xxs}
                    color={getTextColor(notification.level)}
                    contrasted={currentIndex === index || undefined}
                    onClick={() => setCurrentIndex((previousIndex) => index)}
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
