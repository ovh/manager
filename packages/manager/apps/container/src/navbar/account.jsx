import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { capitalize, truncate } from 'lodash-es';
import style from './navbar.module.scss';
import { TRANSLATE_NAMESPACE } from './constants';
import { useHeader } from '@/context/header';
import { useShell } from '@/context';

function NavbarAccount({ user }) {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const shell = useShell();
  const uxPlugin = shell.getPlugin('ux');
  const firstName = capitalize(user.firstname);
  const lastName = truncate(capitalize(user.name), {
    length: 10,
  });

  const { setIsAccountSidebarVisible } = useHeader();

  const toggleSidebar = () => {
    uxPlugin.toggleAccountSidebarVisibility();

    setIsAccountSidebarVisible(uxPlugin?.isAccountSidebarVisible());
  };

  return (
    <button
      role="button"
      type="button"
      className={`oui-navbar-link oui-navbar-link_icon oui-navbar-link_tertiary ${style.navbarLink}`}
      aria-label={t('navbar_account')}
      onClick={() => {
        toggleSidebar();
      }}
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
