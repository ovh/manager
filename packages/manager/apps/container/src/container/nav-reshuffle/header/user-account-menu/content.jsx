/* eslint-disable react/prop-types */
import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { buildURL } from '@ovh-ux/ufrontend';

import { useShell } from '@/context';

import { UserDefaultPaymentMethod } from './default-payment-method.jsx';
import style from './style.module.scss';

const UserAccountMenu = ({ defaultPaymentMethod, isLoading }) => {
  const { t } = useTranslation('user-account-menu');
  const shell = useShell();

  const user = shell
    .getPlugin('environment')
    .getEnvironment()
    .getUser();

  const onLougoutBtnClick = () => {
    shell.getPlugin('auth').logout();
  };

  // @todo: use navigation plugin instead
  const myAccountLink = buildURL('dedicated', '#/useraccount/dashboard');

  return (
    <div className={`${style.menuContent} oui-navbar-menu__wrapper`}>
      <div className="oui-navbar-menu oui-navbar-menu_fixed oui-navbar-menu_end p-3">
        <h1 className="oui-heading_4 mb-1">{`${user.firstname} ${user.name}`}</h1>
        <p className="oui-chip mb-0">
          <strong className={style.supportLevel}>
            {t(
              `user_account_menu_support_level_${user.supportLevel.level}${
                user.isTrusted ? '_trusted' : ''
              }`,
            )}
          </strong>
        </p>
        <p className="mb-0">
          <strong>{user.email}</strong>
        </p>
        {user.email !== user.nichandle && (
          <p className="mb-0">
            <Trans
              t={t}
              i18nKey="user_account_menu_user_id"
              values={{ nichandle: user.nichandle }}
            ></Trans>
          </p>
        )}
        {!user.enterprise && (
          <UserDefaultPaymentMethod
            defaultPaymentMethod={defaultPaymentMethod}
            isLoading={isLoading}
          />
        )}
        <hr />
        <a hre={'#'}>
          <i aria-hidden="true"></i>
          <span>{t('')}</span>
        </a>
        <hr />
        <a
          className="d-block oui-link_icon"
          aria-label={t('user_account_menu_profile')}
          title={t('user_account_menu_profile')}
          href={myAccountLink}
          target="_top"
        >
          {t('user_account_menu_profile')}
          <span
            className="oui-icon oui-icon-arrow-right"
            aria-hidden="true"
          ></span>
        </a>
        <button
          type="button"
          role="button"
          className="w-100 text-left oui-button oui-button_icon-right oui-button_link px-0"
          onClick={onLougoutBtnClick}
          aria-label={t('user_account_menu_profile')}
          title={t('user_account_menu_profile')}
        >
          {t('user_account_menu_logout')}
          <span
            className="oui-icon oui-icon-arrow-right"
            aria-hidden="true"
          ></span>
        </button>
      </div>
    </div>
  );
};

export default UserAccountMenu;
