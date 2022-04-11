import React from 'react';

import { capitalize, truncate } from 'lodash-es';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { TRANSLATE_NAMESPACE } from './constants';
import style from './navbar.module.scss';

import { useShell } from '@/context';
import { useHeader } from '@/context/header';

type Props = {
  user: unknown;
};

function NavbarAccount({ user }: Props): JSX.Element {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const shell = useShell();

  const firstName = capitalize(user.firstname);
  const lastName = truncate(capitalize(user.name), {
    length: 10,
  });

  const { toggleAccountSidebar } = useHeader();

  const toggleSidebar = () => {
    toggleAccountSidebar();
    shell.getPlugin('tracking').trackClick({
     name: 'navbar::action::user-bar',
     type: 'action',
   });
  }

  return (
    <button
      role="button"
      type="button"
      className={`oui-navbar-link oui-navbar-link_icon oui-navbar-link_tertiary ${style.navbarLink}`}
      aria-label={t('navbar_account')}
      onClick={() => toggleSidebar()}
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
