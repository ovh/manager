import React from 'react';

import { useTranslation } from 'react-i18next';

import style from './notifications-sidebar.module.scss';

import useNotifications from '@/core/notifications';
import { useHeader } from '@/context/header';

function NavbarNotifications(): JSX.Element {
  const { t } = useTranslation('navbar');
  // getNavbarNotificationCount
  const { readAllNotifications, notificationsCount } = useNotifications();

  const {
    isNotificationsSidebarVisible,
    setIsNotificationsSidebarVisible,
  } = useHeader();

  function onClick(): void {
    const initialVisibilityState = isNotificationsSidebarVisible;
    setIsNotificationsSidebarVisible(!isNotificationsSidebarVisible);
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

export default NavbarNotifications;
