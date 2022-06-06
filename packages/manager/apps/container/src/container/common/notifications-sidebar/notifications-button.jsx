import React from 'react';
import { useTranslation } from 'react-i18next';

import useNotifications from '@/core/notifications';

import style from './notifications-sidebar.module.scss';
import { useHeader } from '@/context/header';

export default function NavbarNotifications() {
  const { t } = useTranslation('navbar');
  // getNavbarNotificationCount
  const { readAllNotifications, notificationsCount } = useNotifications();

  const {
    isNotificationsSidebarVisible,
    toggleNotificationSidebar,
  } = useHeader();

  function onClick() {
    const initialVisibilityState = isNotificationsSidebarVisible;
    toggleNotificationSidebar();
    if (initialVisibilityState) {
      readAllNotifications();
    }
  }

  return (
    <button
      role="button"
      type="button"
      className={`oui-navbar-link oui-navbar-link_icon oui-navbar-link_tertiary ${style.navbarLink}`}
      title={t('navbar_notifications')}
      aria-label={t('navbar_notifications')}
      onClick={onClick}
    >
      <span className="oui-icon oui-icon-bell" aria-hidden="true">
        {notificationsCount > 0 && (
          <span className="oui-icon__badge">{notificationsCount}</span>
        )}
      </span>
    </button>
  );
}
