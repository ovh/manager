import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { capitalize, truncate } from 'lodash-es';
import { emit, listen } from '@ovh-ux/ufrontend/communication';
import style from './navbar.scss';
import { MESSAGES, TRANSLATE_NAMESPACE } from './constants';

function NavbarAccount({ user }) {
  const [sidebarReady, setSidebarReady] = useState(false);
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
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
          id: MESSAGES.accountSidebarToggle,
        });
      }}
      disabled={!sidebarReady}
    >
      <span className="oui-navbar-link__wrapper oui-navbar-link__wrapper_border">
        <span
          className="oui-icon navbar-oui-icon oui-icon-user"
          aria-hidden="true"
        ></span>
        <span className="oui-navbar-link__text">{`${firstName} ${lastName}`}</span>
      </span>
    </button>
  );
}

NavbarAccount.propTypes = {
  user: PropTypes.object.isRequired,
};

export default NavbarAccount;
