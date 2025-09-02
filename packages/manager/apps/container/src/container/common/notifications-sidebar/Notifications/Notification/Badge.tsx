import { useTranslation } from 'react-i18next';

import style from './notification.module.scss';

import useNotifications from '@/core/notifications';

type Props = {
  isActive?: boolean;
  notificationId?: string;
};

const NotificationBadge = ({
  isActive = false,
  notificationId = '',
}: Props): JSX.Element => {
  const { t } = useTranslation(['notifications-sidebar']);
  const { toggleNotificationReadStatus } = useNotifications();

  const onNotificationBadgeClick = () => {
    toggleNotificationReadStatus(notificationId);
  };

  return (
    <button
      type="button"
      className={`${style['oui-badge']} oui-badge ${
        isActive ? style['oui-badge_error'] : style['oui-badge_info']
      }`}
      onClick={onNotificationBadgeClick}
      data-testid='notification-status-badge'
    >
      <span>{t(`notification_${isActive ? 'unread' : 'read'}`)}</span>
    </button>
  );
};

export default NotificationBadge;
