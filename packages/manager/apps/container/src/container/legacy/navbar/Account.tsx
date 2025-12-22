import { useTranslation } from 'react-i18next';

import { OsdsIcon, OsdsSkeleton, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SKELETON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components/';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

import { TRANSLATE_NAMESPACE } from './constants';
import style from './navbar.module.scss';

import { useShell } from '@/context';
import { useHeader } from '@/context/header';
import { UserName } from '@/components/user-name/UserName.component';
import useContainer from '@/core/container';

function NavbarAccount(): JSX.Element {
  const { t } = useTranslation(TRANSLATE_NAMESPACE);
  const shell = useShell();
  const uxPlugin = shell.getPlugin('ux');

  const {
    setIsAccountSidebarVisible,
    setIsNotificationsSidebarVisible,
  } = useHeader();

  const { isReady } = useContainer();

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
      disabled={!isReady}
    >
      <span className="oui-navbar-link__wrapper oui-navbar-link__wrapper_border">
        <OsdsIcon
          aria-hidden="true"
          className="mr-1"
          name={ODS_ICON_NAME.USER}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
        ></OsdsIcon>
        {isReady ? <UserName size={ODS_TEXT_SIZE._200} /> : <OsdsSkeleton inline={true} size={ODS_SKELETON_SIZE.xs} />}
      </span>
    </button>
  );
}

export default NavbarAccount;
