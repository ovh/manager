import { useTranslation } from 'react-i18next';

import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import style from './notifications-sidebar.module.scss';

import useNotifications from '@/core/notifications';
import { useHeader } from '@/context/header';
import { useShell } from '@/context';

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
        name={ODS_ICON_NAME.BELL}
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_ICON_SIZE.sm}
        aria-hidden="true"
      ></OsdsIcon>
      {notificationsCount > 0 && (
        <span className="oui-icon__badge" data-testid="notifications-count-icon">{notificationsCount}</span>
      )}
    </button>
  );
}

export default NavbarNotifications;
