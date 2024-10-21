import { useCallback, useState } from 'react';

import { Environment } from '@ovh-ux/manager-config';

import { useTranslation } from 'react-i18next';
import { TRANSLATE_NAMESPACE } from './constants';

import Account from './Account';
import Brand from './Brand';
import Hamburger from './HamburgerMenu';
import style from './navbar.module.scss';
import Search from './Search';
import Universes from './Universes';

import useContainer from '@/core/container';
import LanguageMenu from '@/container/common/language';
import modalStyle from '@/container/common/modal.module.scss';
import NavReshuffleSwitchBack from '@/container/common/nav-reshuffle-switch-back';
import Notifications from '@/container/common/notifications-sidebar/NotificationsButton';
import { useShell } from '@/context';
import { useHeader } from '@/context/header';
import { useUniverses } from '@/hooks/useUniverses';
import { useMediaQuery } from 'react-responsive';
import { SMALL_DEVICE_MAX_SIZE } from '@/container/common/constants';

type Props = {
  environment: Environment;
};

function Navbar({ environment }: Props): JSX.Element {
  const shell = useShell();
  const { universe, setUniverse } = useContainer();
  const { getUniverses, getHubUniverse } = useUniverses();
  const [userLocale, setUserLocale] = useState(
    shell.getPlugin('i18n').getLocale(),
  );
  const isSmallDevice = useMediaQuery({
    query: `(max-width: ${SMALL_DEVICE_MAX_SIZE})`,
  });

  const [searchURL] = useState<string>();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { setIsNotificationsSidebarVisible } = useHeader();
  const { t } = useTranslation(TRANSLATE_NAMESPACE);

  const brandClickHandler = useCallback(
    () =>
      shell.getPlugin('tracking').trackClick({
        name: `navbar::entry::logo`,
        type: 'action',
      }),
    [shell],
  );

  const universeClickHandler = useCallback(
    ({ universe }: Partial<Environment>) => {
      shell.getPlugin('tracking').trackClick({
        name: `navbar::entry::${universe}`,
        type: 'action',
      });
      setUniverse(universe);
    },
    [shell],
  );

  return (
    <>
      <div
        className={`${modalStyle.popoverClickAway} ${isDropdownOpen ? '' : modalStyle.hidden
          }`}
      ></div>
      <div
        className={`oui-navbar ${style.navbar}`}
        role="navigation"
        aria-label={t('navbar_menu_name')}
      >
        <Hamburger universe={universe} universes={getUniverses()} />
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
          {!isSmallDevice &&
            <div className="oui-navbar-list__item">
              <NavReshuffleSwitchBack />
            </div>
          }
          <div className="oui-navbar-list__item">
            <LanguageMenu
              setUserLocale={setUserLocale}
              userLocale={userLocale}
              onChange={(show: boolean) => {
                setIsDropdownOpen(show);
                setIsNotificationsSidebarVisible(false);
              }}
            ></LanguageMenu>
          </div>
          <div className="oui-navbar-list__item">
            <Notifications />
          </div>
          <Account />
        </div>
      </div>
      {isSmallDevice &&
        <div className={style['small-device-pnr-switch']}>
          <NavReshuffleSwitchBack />
        </div>
      }
    </>
  );
}

export default Navbar;
