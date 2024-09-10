import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT, ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import useNotifications from '@/core/notifications';
import { useTranslation } from 'react-i18next';
import { useHeader } from '@/context/header';
import { FunctionComponent } from 'react';
import { useShell } from '@/context';

export const NotificationsButton: FunctionComponent = () => {
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
      <OsdsButton
        role="button"
        title={t('navbar_notifications')}
        aria-label={t('navbar_notifications')}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onClick}
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.ghost}
      >
        <OsdsIcon
          name={ODS_ICON_NAME.BELL}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_ICON_SIZE.sm}
          aria-hidden="true"
        ></OsdsIcon>
        {notificationsCount > 0 && (
          <span slot="end" className='!m-0'>
            <sub>
              <div className="w-6 h-6 bg-red-700 text-white flex items-center justify-center rounded-full">
                {notificationsCount}
              </div>
            </sub>
          </span>
        )}
      </OsdsButton>
  );
}