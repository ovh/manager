import React from 'react';

import { useTranslation, Trans } from 'react-i18next';

import icon from './assets/give_feedback.png';
import UserDefaultPaymentMethod from './DefaultPaymentMethod';
import style from './style.module.scss';

import { useShell } from '@/context';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

type Props = {
  defaultPaymentMethod?: unknown;
  isLoading?: boolean;
};

const UserAccountMenu = ({
  defaultPaymentMethod = {},
  isLoading = false,
}: Props): JSX.Element => {
  const { t } = useTranslation('user-account-menu');
  const shell = useShell();
  const trackingPlugin = shell.getPlugin('tracking');
  const environment = shell.getPlugin('environment').getEnvironment();
  const region = environment.getRegion();

  const { getFeedbackUrl, closeAccountSidebar } = useProductNavReshuffle();
  const feedbackUrl = getFeedbackUrl();

  const user = shell
    .getPlugin('environment')
    .getEnvironment()
    .getUser();

  const isProvider = user.auth.method === 'provider';

  const onLougoutBtnClick = () => {
    trackingPlugin.trackClick({
      name: 'topnav::user_widget::logout',
      type: 'action',
    });
    shell.getPlugin('auth').logout();
  };

  const onGiveFeedbackLinkClick = () => {
    closeAccountSidebar();
    trackingPlugin.trackClick({
      name: 'topnav::user_widget::give_feedback',
      type: 'action',
    });
  };

  const onMyAccountLinkClick = () => {
    closeAccountSidebar();
    trackingPlugin.trackClick({
      name: 'topnav::user_widget::go_to_profile',
      type: 'navigation',
    });
  };

  const myAccountLink = shell
    .getPlugin('navigation')
    .getURL('dedicated', '#/useraccount/dashboard');

  return (
    <div className={`${style.menuContent} oui-navbar-menu__wrapper`}>
      <div
        className="oui-navbar-menu oui-navbar-menu_fixed oui-navbar-menu_end p-3"
        data-navi-id="account-sidebar-block"
      >
        <h1 className="oui-heading_4 mb-1">{`${user.firstname} ${user.name}`}</h1>
        {['EU', 'CA'].includes(region) && (
          <p className="oui-chip mb-0">
            <strong className={style.supportLevel}>
              {t(
                `user_account_menu_support_level_${user.supportLevel.level}${
                  user.isTrusted ? '_trusted' : ''
                }`,
              )}
            </strong>
          </p>
        )}
        {!isProvider && (
          <p className="mb-0" data-navi-id="account-email">
            <strong>{user.email}</strong>
          </p>
        )}
        {isProvider && (
          <p className="mb-0" data-navi-id="account-username">
            <strong>{user.auth.user}</strong>
          </p>
        )}
        {user.email !== user.nichandle && (
          <p className="mb-0">
            <Trans
              t={t}
              i18nKey="user_account_menu_user_id"
              values={{ nichandle: user.nichandle }}
            ></Trans>
          </p>
        )}

        {isProvider && (
          <p className={`ml-0 oui-badge oui-badge_warning`} data-navi-id="account-auth-method">
            <strong>{t(`user_account_menu_role_provider`)}</strong>
          </p>
        )}

        {!user.enterprise && (
          <UserDefaultPaymentMethod
            defaultPaymentMethod={defaultPaymentMethod}
            isLoading={isLoading}
          />
        )}
        <hr />
        <a
          href={feedbackUrl}
          className={`${style.feedback} d-flex`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('user_account_menu_beta_feedback')}
          onClick={onGiveFeedbackLinkClick}
        >
          <span className="align-self-center">
            <img src={icon} alt={t('user_account_menu_beta_feedback')} />
          </span>
          <span className="pl-2">
            <span className={`${style.feedback_title} d-block oui-link_icon`}>
              <span>{t('user_account_menu_beta_feedback')}</span>
              <span
                className="oui-icon oui-icon-arrow-right ml-2"
                aria-hidden="true"
              ></span>
            </span>
            <span className={`${style.feedback_text} d-block`}>
              {t('user_account_menu_beta_feedback_text')}
            </span>
          </span>
        </a>
        <hr />
        <a
          onClick={onMyAccountLinkClick}
          className="d-block oui-link_icon"
          aria-label={t('user_account_menu_profile')}
          title={t('user_account_menu_profile')}
          href={myAccountLink}
          target="_top"
          id="user-account-menu-profile"
          data-navi-id="profile"
        >
          {t('user_account_menu_profile')}
          <span
            className={`${style.myAccountIcon} oui-icon oui-icon-arrow-right`}
            aria-hidden="true"
          ></span>
        </a>
        <button
          type="button"
          role="button"
          className="w-100 text-left oui-button oui-button_icon-right oui-button_link px-0"
          onClick={onLougoutBtnClick}
          aria-label={t('user_account_menu_logout')}
          title={t('user_account_menu_logout')}
          data-navi-id="logout"
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
