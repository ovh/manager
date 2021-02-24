import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { emit, listen } from '@ovh-ux/ufrontend/communication';
import style from './navbar.scss';
import { MESSAGES } from './constants';

function NavbarNotifications() {
  const { t } = useTranslation();
  const [notificationsCount, setNotificationsCount] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    listen(MESSAGES.notificationsCount, ({ count }) => {
      setNotificationsCount(count);
    });

    listen(MESSAGES.notificationsStatusChange, ({ status }) => {
      setIsOpen(status);
    });
  }, []);

  function onClick() {
    if (isOpen) {
      emit({
        id: MESSAGES.notificationsHide,
      });
    } else {
      emit({
        id: MESSAGES.notificationsOpen,
      });
    }
  }

  return (
    <button
      role="button"
      type="button"
      className={`oui-navbar-link oui-navbar-link_icon oui-navbar-link_tertiary ${style.navbarLink}`}
      title={t('navbar_notifications')}
      aria-label={t('navbar_notifications')}
      disabled={notificationsCount === null}
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
