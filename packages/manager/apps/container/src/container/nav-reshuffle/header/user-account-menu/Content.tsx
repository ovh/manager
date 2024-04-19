import React from 'react';
import { useTranslation, Trans } from 'react-i18next';

import UserDefaultPaymentMethod from './DefaultPaymentMethod';
import style from './style.module.scss';
import { links } from './constants';

import { useShell } from '@/context';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

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
  const { closeAccountSidebar } = useProductNavReshuffle();

  const user = shell
    .getPlugin('environment')
    .getEnvironment()
    .getUser();

  const isSubUser = ['provider', 'user'].includes(user.auth.method);

  const displayUserName = {
    userName: isSubUser ? user.auth.user : `${user.firstname} ${user.name}`,
    className: `oui-heading_4 mb-1 ${isSubUser && 'text-truncate'}`,
  };

  const onLougoutBtnClick = () => {
    trackingPlugin.trackClick({
      name: 'topnav::user_widget::logout',
      type: 'action',
    });
    shell.getPlugin('auth').logout();
  };

  const onLinkClick = () => {
    closeAccountSidebar();
    trackingPlugin.trackClick({
      type: 'navigation',
    });
  };

  const onMyAccountLinkClick = () => {
    closeAccountSidebar();
    trackingPlugin.trackClick({
      name: 'topnav::user_widget::go_to_profile',
      type: 'navigation',
    });
  };

  const getUrl = (key: string, hash: string) =>
    shell.getPlugin('navigation').getURL(key, hash);
  const myAccountLink = getUrl('dedicated', '#/useraccount/dashboard');
  const ssoLink = getUrl('dedicated', '#/useraccount/users');
  const supportLink = getUrl('dedicated', '#/useraccount/support/level');

  return (
    <div className={`${style.menuContent} oui-navbar-menu__wrapper`}>
      <div
        className="oui-navbar-menu oui-navbar-menu_fixed oui-navbar-menu_end p-4"
        data-navi-id="account-sidebar-block"
      >
        <div className="border-bottom pb-2 pt-2">
          <h1 className={displayUserName.className}>
            {displayUserName.userName}
          </h1>
          <a
            onClick={onMyAccountLinkClick}
            className="d-block my-3"
            aria-label={t('user_account_menu_profile')}
            title={t('user_account_menu_profile')}
            href={myAccountLink}
            target="_top"
            id="user-account-menu-profile"
            data-navi-id="profile"
          >
            {t('user_account_menu_profile')}
          </a>
          <p
            className={`${style.ellipsis} mb-0`}
            data-navi-id="account-email"
            title={user.email}
          >
            {user.email}
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
        </div>
        <div className="border-bottom pb-2 pt-2">
          <div className={`d-flex justify-content-between ${style.menuContentRow}`}>
            <span>{t('user_account_menu_role_connexion')}</span>
            <a href={ssoLink}>
              <OsdsChip color={ODS_THEME_COLOR_INTENT.success} className={style.menuContentRowChip} selectable={true}>
                {t(`user_account_menu_role_${user.auth.method}`)}
              </OsdsChip>
            </a>
          </div>
          {!user.enterprise && (
            <UserDefaultPaymentMethod
              defaultPaymentMethod={defaultPaymentMethod}
              isLoading={isLoading}
            />
          )}
          {['EU', 'CA'].includes(region) && (
            <div className={`d-flex mt-1 justify-content-between ${style.menuContentRow}`}>
              <span>{t('user_account_menu_support')}</span>
              <a href={supportLink}>
                <OsdsChip color={ODS_THEME_COLOR_INTENT.info} className={style.menuContentRowChip} selectable={true}>
                  {t(
                    `user_account_menu_support_level_${
                      user.supportLevel.level
                    }${user.isTrusted ? '_trusted' : ''}`,
                  )}
                </OsdsChip>
              </a>
            </div>
          )}
        </div>
        <div className="border-bottom pb-2 pt-2">
          {links.map(({ key, hash, i18nKey }) => (
            <a
              key={key}
              onClick={onLinkClick}
              className="d-block"
              aria-label={t(i18nKey)}
              title={t(i18nKey)}
              href={getUrl('dedicated', hash)}
              target="_top"
            >
              {t(i18nKey)}
            </a>
          ))}
        </div>

        <button
          type="button"
          role="button"
          className="w-100 oui-button oui-button_link mt-3 center"
          onClick={onLougoutBtnClick}
          aria-label={t('user_account_menu_logout')}
          title={t('user_account_menu_logout')}
          data-navi-id="logout"
        >
          {t('user_account_menu_logout')}
        </button>
      </div>
    </div>
  );
};

export default UserAccountMenu;
