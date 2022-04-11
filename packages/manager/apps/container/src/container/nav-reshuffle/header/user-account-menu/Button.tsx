import React from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import style from './style.module.scss';

const UserAccountMenuButton = ({
  children,
  onClick,
  show,
}: Props): JSX.Element => {
  const { t } = useTranslation('user-account-menu');
  return (
    <button
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

UserAccountMenuButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  onClick: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

UserAccountMenuButton.defaultProps = {
  children: null,
  show: false,
};

export default UserAccountMenuButton;
