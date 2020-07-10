import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { capitalize, truncate } from 'lodash-es';
import { emit, listen } from '@ovh-ux/ufrontend/communication';
import style from './navbar.scss';
import { MESSAGES } from './constants';

function NavbarAccount({ user }) {
  const [sidebarReady, setSidebarReady] = useState(false);
  const { t } = useTranslation();
  const firstName = capitalize(user.firstname);
  const lastName = truncate(capitalize(user.name), {
    length: 10,
  });

  useEffect(() => {
    listen(({ id }) => {
      if (id === MESSAGES.accountSidebarReady) {
        setSidebarReady(true);
      }
    });
  }, []);

  return (
    <button
      role="button"
      type="button"
      className={`oui-navbar-link oui-navbar-link_icon oui-navbar-link_tertiary ${style.navbarLink}`}
      aria-label={t('navbar_account')}
      onClick={() => {
        emit({
          id: MESSAGES.notificationsHide,
        });
        emit({
          id: MESSAGES.accountSidebarToggle,
        });
      }}
      disabled={!sidebarReady}
    >
      <i className="oui-icon oui-icon-user_extra-thin" aria-hidden="true"></i>
      {`${firstName} ${lastName}`}
    </button>
  );
}

NavbarAccount.propTypes = {
  user: PropTypes.object.isRequired,
};

export default NavbarAccount;
