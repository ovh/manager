import React, { Suspense, useCallback, useState } from 'react';

import { Environment } from '@ovh-ux/manager-config';

import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';
import { TRANSLATE_NAMESPACE } from './constants';

import Account from './Account';
import Brand from './Brand';
import style from './navbar.module.scss';
import Search from './Search';
import Universes from './Universes';

import useContainer from '@/core/container';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import CloudShellLink from '@/container/common/cloud-shell';
import { LanguageMenuContainer } from '@/container/common/language/container.component';
import modalStyle from '@/container/common/modal.module.scss';
import NavReshuffleSwitchBack from '@/container/common/nav-reshuffle-switch-back';
import Notifications from '@/container/common/notifications-sidebar/NotificationsButton';
import { useShell } from '@/context';
import { useHeader } from '@/context/header';
import { useUniverses } from '@/hooks/useUniverses';
import {
  SMALL_DEVICE_MAX_SIZE,
  MOBILE_WIDTH_RESOLUTION,
} from '@/container/common/constants';

const HamburgerMenu = React.lazy(() => import('./HamburgerMenu'));

function Navbar(): JSX.Element {
  const shell = useShell();
  const { isReady, universe, setUniverse } = useContainer();
  const { getUniverses, getHubUniverse } = useUniverses();
  const isSmallDevice = useMediaQuery({
    query: `(max-width: ${SMALL_DEVICE_MAX_SIZE})`,
  });

  const isMobile = useMediaQuery({
    query: `(max-width: ${MOBILE_WIDTH_RESOLUTION}px)`,
  });

  const { data: cloudShellAvailability } = useFeatureAvailability(
    ['cloud-shell'],
  );

  const [searchURL] = useState<string>();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { setIsNotificationsSidebarVisible } = useHeader();
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  const brandClickHandler = useCallback(
    () =>
      shell.getPlugin('tracking')?.trackClick({
        name: `navbar::entry::logo`,
        type: 'action',
      }),
    [shell],
  );

  const universeClickHandler = useCallback(
    ({ universe }: Partial<Environment>) => {
      if (isReady) {
        shell.getPlugin('tracking').trackClick({
          name: `navbar::entry::${universe}`,
          type: 'action',
        });
        setUniverse(universe);
      }
    },
    [shell, isReady],
  );

  return (
    <>
      <div
        className={`${modalStyle.popoverClickAway} ${
          isDropdownOpen ? '' : modalStyle.hidden
        }`}
      ></div>
      <div
        className={`oui-navbar ${style.navbar}`}
        role="navigation"
        aria-label={t('navbar_menu_name')}
      >
        {isMobile && (
          <Suspense fallback={<></>}>
            <HamburgerMenu universe={universe} universes={getUniverses()} />
          </Suspense>
        )}
        <Brand
          targetURL={getHubUniverse()?.url || '#'}
          onClick={brandClickHandler}
        />
        <Universes
          universe={universe}
          universes={getUniverses()}
          onClick={universeClickHandler}
        />
        <div
          className={`oui-navbar-list oui-navbar-list_aside oui-navbar-list_end ${style.aside}`}
        >
          {searchURL && (
            <div className="oui-navbar-list__item">
              <Search targetURL={searchURL} />
            </div>
          )}
          {!isSmallDevice && (
            <div className="oui-navbar-list__item">
              <NavReshuffleSwitchBack />
            </div>
          )}
          <div className="oui-navbar-list__item">
            <LanguageMenuContainer
              onChange={(show: boolean) => {
                setIsDropdownOpen(show);
                setIsNotificationsSidebarVisible(false);
              }}
            ></LanguageMenuContainer>
          </div>
          {isReady && cloudShellAvailability?.['cloud-shell'] && (
            <div className="oui-navbar-list__item">
              <CloudShellLink />
            </div>
          )}
          <div className="oui-navbar-list__item">
            <Notifications />
          </div>
          <Account />
        </div>
      </div>
      {isSmallDevice && (
        <div className={style['small-device-pnr-switch']}>
          <NavReshuffleSwitchBack />
        </div>
      )}
    </>
  );
}

export default Navbar;
