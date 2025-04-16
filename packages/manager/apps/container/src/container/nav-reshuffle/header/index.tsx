import { useState, Suspense } from 'react';

import { useMediaQuery } from 'react-responsive';
import HamburgerMenu from './HamburgerMenu';
import UserAccountMenu from './user-account-menu';

import LanguageMenu from '@/container/common/language';
import modalStyle from '@/container/common/modal.module.scss';
import NavReshuffleSwitchBack from '@/container/common/nav-reshuffle-switch-back';
import NotificationsSidebar from '@/container/common/notifications-sidebar';
import Notifications from '@/container/common/notifications-sidebar/NotificationsButton';
import ApplicationContext, { useShell } from '@/context';
import { useHeader } from '@/context/header';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import { Logo } from '@/container/common/Logo';

import style from './style.module.scss';
import { SMALL_DEVICE_MAX_SIZE } from '@/container/common/constants';

type Props = {
  isSidebarExpanded?: boolean;
  onHamburgerMenuClick?(): void;
  onUserAccountMenuToggle?(show: boolean): void;
};

function Header({
  isSidebarExpanded = false,
  onHamburgerMenuClick = () => {},
  onUserAccountMenuToggle = () => {},
}: Props): JSX.Element {
  const shell = useShell();
  const [userLocale, setUserLocale] = useState<string>(
    shell.getPlugin('i18n').getLocale(),
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { setIsNotificationsSidebarVisible } = useHeader();
  const isSmallDevice = useMediaQuery({
    query: `(max-width: ${SMALL_DEVICE_MAX_SIZE})`,
  });
  const navigationPlugin = shell.getPlugin('navigation');
  const logoLink = navigationPlugin.getURL('hub', '#/');
  const { isMobile } = useProductNavReshuffle();
  const isUS = shell?.getPlugin('environment')?.getEnvironment()?.getRegion() === 'US';

  return (
    <ApplicationContext.Consumer>
      {() => (
        <Suspense fallback="">
          <div
            className={`${modalStyle.popoverClickAway} ${
              isDropdownOpen ? '' : modalStyle.hidden
            }`}
          ></div>
          <div className={`oui-navbar ${style.navbar}`}>
            <HamburgerMenu
              isOpen={isSidebarExpanded}
              onClick={onHamburgerMenuClick}
            />
            {isMobile && (
              <a
                role="img"
                className={`block ${style.navbarLogo} ml-2`}
                aria-label="OVHcloud"
                target="_top"
                href={logoLink}
              >
                <Logo />
              </a>
            )}
            <div
              className={`oui-navbar-list oui-navbar-list_aside oui-navbar-list_end ${style.navbarList}`}
            >
              {!isSmallDevice && isUS && (
                <div className={`oui-navbar-list__item ${style.navbarListItem}`}>
                  <NavReshuffleSwitchBack />
                </div>
              )}
              <div className={`oui-navbar-list__item ${style.navbarListItem}`}>
                <LanguageMenu
                  setUserLocale={setUserLocale}
                  userLocale={userLocale}
                  onChange={(show: boolean) => {
                    setIsDropdownOpen(show);
                    setIsNotificationsSidebarVisible(false);
                  }}
                ></LanguageMenu>
              </div>
              <div className={`oui-navbar-list__item ${style.navbarListItem}`}>
                <Notifications />
              </div>
              <div className={`oui-navbar-list__item ${style.navbarListItem}`}>
                <UserAccountMenu
                  onToggle={(show: boolean) => {
                    setIsDropdownOpen(show);
                    onUserAccountMenuToggle(show);
                  }}
                />
              </div>
            </div>
          </div>
          {isSmallDevice && isUS && (
            <div className={style['small-device-pnr-switch']}>
              <NavReshuffleSwitchBack />
            </div>
          )}
          <NotificationsSidebar />
        </Suspense>
      )}
    </ApplicationContext.Consumer>
  );
}

export default Header;
