import { useTranslation } from 'react-i18next';

import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import style from './notifications-sidebar.module.scss';

import useNotifications from '@/core/notifications';
import { useHeader } from '@/context/header';
import { useShell } from '@/context';
import useContainer from '@/core/container';
import clsx from 'clsx';
import { useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import { MOBILE_WIDTH_RESOLUTION } from '../constants';

function NavbarNotifications(): JSX.Element {
  const { t } = useTranslation('navbar');
  const shell = useShell();
  const trackingPlugin = shell.getPlugin('tracking');
  const { notifications, readAllNotifications } = useNotifications();
  const { useBeta } = useContainer();

  const {
    isNotificationsSidebarVisible,
    setIsNotificationsSidebarVisible,
  } = useHeader();

  const noticiationsCount = useMemo(() => {
    return (notifications || []).filter(({ isActive }) =>
      isActive(),
    ).length;
  }, [notifications]);

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

  const isMobile = useMediaQuery({
    query: `(max-width: ${MOBILE_WIDTH_RESOLUTION}px)`,
  });

  const buttonClassName = clsx(
    'oui-navbar-link oui-navbar-link_icon oui-navbar-link_tertiary block bg-transparent',
    useBeta && '*:bg-[var(--ods-color-primary-100)] relative p-0 flex items-center justify-center size-10',
    !useBeta && 'disabled:opacity-50',
  );

  const badgeClassName = clsx(
    'oui-icon__badge',
    useBeta && 'absolute whitespace-nowrap bottom-0 right-0 mb-1 mr-1',
  );

  const iconClassName = clsx(
    useBeta && 'size-7',
    isMobile && useBeta && 'size-8',
  );

  return (
    <button
      role="button"
      type="button"
      className={buttonClassName}
      title={t('navbar_notifications')}
      aria-label={t('navbar_notifications')}
      onClick={onClick}
    >
      <OsdsIcon
        name={ODS_ICON_NAME.BELL}
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_ICON_SIZE.sm}
        aria-hidden="true"
        className={iconClassName}
      ></OsdsIcon>
      {noticiationsCount > 0 && (
        <span className={badgeClassName} data-testid="notifications-count-icon">
          {noticiationsCount}
        </span>
      )}
    </button>
  );
}

export default NavbarNotifications;
