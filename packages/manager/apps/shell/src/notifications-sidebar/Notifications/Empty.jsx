import React from 'react';
import { useTranslation } from 'react-i18next';

import style from './notifications.module.scss';

const NotificationsEmpty = () => {
  const { t } = useTranslation(['notifications-sidebar']);

  return (
    <li>
      <div>
        <p className={style.notificationsList_empty_placeholder}>
          <span
            className="oui-icon oui-navbar-notification__icon oui-icon-success-circle"
            aria-hidden="true"
          ></span>
          <span>{t('no_notifications_title')}</span>
        </p>
        <div>{t('no_notifications_description')}</div>
      </div>
    </li>
  );
};

export default NotificationsEmpty;
