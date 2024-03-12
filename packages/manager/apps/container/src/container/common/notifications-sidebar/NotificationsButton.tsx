import React from 'react';

import { useTranslation } from 'react-i18next';

import style from './notifications-sidebar.module.scss';

import useNotifications from '@/core/notifications';
import { useHeader } from '@/context/header';
import { useShell } from '@/context';
import { OsdsIcon } from '@ovhcloud/ods-stencil/components/react';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';
import { OdsIconName, OdsIconSize } from '@ovhcloud/ods-core';

function NavbarNotifications(): JSX.Element {
  const { t } = useTranslation('navbar');
  const shell = useShell();
  const trackingPlugin = shell.getPlugin('tracking');
  const { notifications, readAllNotifications } = useNotifications();

  const {
    isNotificationsSidebarVisible,
    setIsNotificationsSidebarVisible,
  } = useHeader();

  const notificationsCount = (notifications || []).filter(({ isActive }) =>
    isActive(),
  ).length;

  function onClick(): void {
    trackingPlugin.trackClick({
      name: 'topnav::notifications',
      type: 'action',
    });
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
      <OsdsIcon
        name={OdsIconName.BELL}
        color={OdsThemeColorIntent.primary}
        size={OdsIconSize.sm}
        aria-hidden="true"
      ></OsdsIcon>
      {notificationsCount > 0 && (
        <span className="oui-icon__badge">{notificationsCount}</span>
      )}
    </button>
  );
}

export default NavbarNotifications;
