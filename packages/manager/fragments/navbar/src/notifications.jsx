import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { emit, listen } from '@ovh-ux/ufrontend/communication';
import style from './navbar.scss';
import { MESSAGES } from './constants';

function NavbarNotifications() {
  const { t } = useTranslation();
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    listen(({ id, count }) => {
      if (id === MESSAGES.notificationsCount) {
        setNotificationsCount(count);
      }
    });
  }, []);

  return (
    <button
      role="button"
      type="button"
      className={`oui-navbar-link oui-navbar-link_icon oui-navbar-link_tertiary ${style.navbarLink}`}
      title={t('navbar_notifications')}
      aria-label={t('navbar_notifications')}
      disabled={notificationsCount === 0}
      onClick={() => {
        emit({
          id: MESSAGES.accountSidebarHide,
        });
        emit({
          id: MESSAGES.notificationsToggle,
        });
      }}
    >
      <span className="oui-icon oui-icon-bell" aria-hidden="true">
        <span className="oui-icon__badge">{notificationsCount}</span>
      </span>
    </button>
  );
}

export default NavbarNotifications;
