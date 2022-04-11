import React, { useState, Suspense } from 'react';

import PropTypes from 'prop-types';

import HamburgerMenu from './HamburgerMenu';
import UserAccountMenu from './user-account-menu';

import LanguageMenu from '@/container/common/language';
import modalStyle from '@/container/common/modal.module.scss';
import NavReshuffleSwitchBack from '@/container/common/nav-reshuffle-switch-back';
import NotificationsSidebar from '@/container/common/notifications-sidebar';
import Notifications from '@/container/common/notifications-sidebar/NotificationsButton';
import ApplicationContext, { useShell } from '@/context';
import { NotificationsProvider } from '@/core/notifications';

type Props = {
  isSidebarExpanded: boolean;
  onHamburgerMenuClick(): void;
  onUserAccountMenuToggle(): void;
};

function Header({
  isSidebarExpanded,
  onHamburgerMenuClick,
  onUserAccountMenuToggle,
}: Props): JSX.Element {
  const shell = useShell();
  const [userLocale, setUserLocale] = useState(
    shell.getPlugin('i18n').getLocale(),
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <ApplicationContext.Consumer>
      {({ environment }) => (
        <Suspense fallback="">
          <div
            className={`${modalStyle.popoverClickAway} ${
              isDropdownOpen ? '' : modalStyle.hidden
            }`}
          ></div>
          <div className="oui-navbar">
            <HamburgerMenu
              isOpen={isSidebarExpanded}
              onClick={onHamburgerMenuClick}
            />
            <div className="oui-navbar-list oui-navbar-list_aside oui-navbar-list_end">
              <div className="oui-navbar-list__item">
                <NavReshuffleSwitchBack
                  onChange={({ show }) => setIsDropdownOpen(show)}
                />
              </div>
              <div className="oui-navbar-list__item">
                <LanguageMenu
                  setUserLocale={setUserLocale}
                  userLocale={userLocale}
                  onChange={({ show }) => setIsDropdownOpen(show)}
                ></LanguageMenu>
              </div>
              <div className="oui-navbar-list__item">
                <NotificationsProvider environment={environment}>
                  <NotificationsSidebar environment={environment} />
                  <Notifications />
                </NotificationsProvider>
              </div>
              <div className="oui-navbar-list__item">
                <UserAccountMenu
                  onToggle={({ show }) => {
                    setIsDropdownOpen(show);
                    onUserAccountMenuToggle(show);
                  }}
                />
              </div>
            </div>
          </div>
        </Suspense>
      )}
    </ApplicationContext.Consumer>
  );
}

Header.propTypes = {
  isSidebarExpanded: PropTypes.bool,
  onHamburgerMenuClick: PropTypes.func,
  onUserAccountMenuToggle: PropTypes.func,
};

Header.defaultProps = {
  isSidebarExpanded: false,
  onHamburgerMenuClick: () => {},
  onUserAccountMenuToggle: () => {},
};

export default Header;
