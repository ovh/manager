import React from 'react';
import { useTranslation } from 'react-i18next';

import useNotifications from '@/core/notifications';

import style from './notification.module.scss';

const NotificationBadge = ({ isActive, notificationId }) => {
  const { t } = useTranslation(['notifications-sidebar']);
  const { toggleNotificationReadStatus } = useNotifications();

  const onNotificationBadgeClick = () => {
    toggleNotificationReadStatus(notificationId);
  };

  return (
    <button
      type="button"
      className={`${style['oui-badge']} oui-badge ${
        style['oui-badge_' + (!isActive ? 'info' : 'error')]
      }`}
      onClick={onNotificationBadgeClick}
    >
      <span>{t(`notification_${isActive ? 'unread' : 'read'}`)}</span>
    </button>
  );
};

export default NotificationBadge;
