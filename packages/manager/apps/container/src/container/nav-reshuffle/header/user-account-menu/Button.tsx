import React from 'react';

import { useTranslation } from 'react-i18next';

import style from './style.module.scss';

type Props = {
  children?: JSX.Element | JSX.Element[];
  onClick(show: boolean): void;
  show?: boolean;
};

const UserAccountMenuButton = ({
  children = null,
  onClick,
  show = false,
}: Props): JSX.Element => {
  const { t } = useTranslation('user-account-menu');
  return (
    <button
      id="header-user-menu-button"
      aria-haspopup={show}
      aria-expanded={show}
      aria-label={t('user_account_menu_manage_my_account')}
      title={t('user_account_menu_manage_my_account')}
      type="button"
      className={`${style.button} oui-navbar-link oui-navbar-link_dropdown`}
      onClick={(e) => {
        e.preventDefault();
        onClick(!show);
      }}
    >
      <span className="oui-navbar-link__wrapper">
        <span className="oui-navbar-link__text">{children}</span>
      </span>
    </button>
  );
};

export default UserAccountMenuButton;
