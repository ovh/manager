import React from 'react';

import { capitalize, truncate } from 'lodash-es';
import { useTranslation } from 'react-i18next';

import { OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components/';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import { User } from '@ovh-ux/manager-config';
import { TRANSLATE_NAMESPACE } from './constants';
import style from './navbar.module.scss';

import { useShell } from '@/context';
import { useHeader } from '@/context/header';
import { LEGAL_FORMS } from '@/container/common/constants';
import useUser from '@/hooks/user/useUser';

function NavbarAccount(): JSX.Element {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const shell = useShell();
  const uxPlugin = shell.getPlugin('ux');
  const user = useUser();

  const firstName = capitalize(user.firstname).replace(/-[a-z]/g, (match) =>
    match.toUpperCase(),
  );
  const lastName = truncate(capitalize(user.name), {
    length: 10,
  });

  const {
    setIsAccountSidebarVisible,
    setIsNotificationsSidebarVisible,
  } = useHeader();

  const toggleSidebar = () => {
    uxPlugin.toggleAccountSidebarVisibility();
    setIsAccountSidebarVisible(uxPlugin.isAccountSidebarVisible());
    setIsNotificationsSidebarVisible(false);
    shell.getPlugin('tracking').trackClick({
      name: 'navbar::action::user-bar',
      type: 'action',
    });
  };

  return (
    <button
      role="button"
      type="button"
      className={`oui-navbar-link oui-navbar-link_icon oui-navbar-link_tertiary ${style.navbarLink}`}
      aria-label={t('navbar_account')}
      onClick={() => toggleSidebar()}
    >
      <span className="oui-navbar-link__wrapper oui-navbar-link__wrapper_border">
        <OsdsIcon
          aria-hidden="true"
          className="mr-1"
          name={ODS_ICON_NAME.USER}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
        ></OsdsIcon>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.primary}
          level={ODS_TEXT_LEVEL.button}
          size={ODS_TEXT_SIZE._200}
        >
          {user.legalform === LEGAL_FORMS.CORPORATION ?
            user.organisation : `${user.firstname} ${user.name}`}
        </OsdsText>
      </span>
    </button>
  );
}

export default NavbarAccount;
