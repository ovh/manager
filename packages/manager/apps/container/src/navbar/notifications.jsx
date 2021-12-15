import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useNotifications from '../core/notifications';

import style from './navbar.module.scss';
import { TRANSLATE_NAMESPACE } from './constants';

function NavbarNotifications(props) {
  const { ux } = props;
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  const { getNavbarNotificationCount, toggleSidebar, isSidebarOpen } = ux;
  const { readAllNotifications } = useNotifications();

  const notificationCount = getNavbarNotificationCount();

  function onClick() {
    const openState = isSidebarOpen('notifications');
    toggleSidebar('notifications');
    if (openState) {
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
        {notificationCount > 0 && (
          <span className="oui-icon__badge">{notificationCount}</span>
        )}
      </span>
    </button>
  );
}

export default NavbarNotifications;
