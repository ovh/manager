import React, { useState, Suspense } from 'react';

import HamburgerMenu from './HamburgerMenu';
import UserAccountMenu from './user-account-menu';

import LanguageMenu from '@/container/common/language';
import modalStyle from '@/container/common/modal.module.scss';
import NavReshuffleSwitchBack from '@/container/common/nav-reshuffle-switch-back';
import NotificationsSidebar from '@/container/common/notifications-sidebar';
import Notifications from '@/container/common/notifications-sidebar/NotificationsButton';
import ApplicationContext, { useShell } from '@/context';
import { useHeader } from '@/context/header';

import style from './style.module.scss';

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

  return (
    <ApplicationContext.Consumer>
      {({ environment }) => (
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
            <div className={`oui-navbar-list oui-navbar-list_aside oui-navbar-list_end ${style.navbarList}`}>
              <div className={`oui-navbar-list__item ${style.navbarListItem}`}>
                <NavReshuffleSwitchBack />
              </div>
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
          <NotificationsSidebar />
        </Suspense>
      )}
    </ApplicationContext.Consumer>
  );
}

export default Header;
