import React, { useState, Suspense } from 'react';
import PropTypes from 'prop-types';

import Notifications from '@/container/common/notifications-sidebar/notifications-button';
import NotificationsSidebar from '@/container/common/notifications-sidebar';
import LanguageMenu from '@/container/common/language';
import { NotificationsProvider } from '@/core/notifications';
import ApplicationContext, { useShell } from '@/context';
import HamburgerMenu from './hamburger-menu';
import NavReshuffleSwitchBack from '@/container/common/nav-reshuffle-switch-back';
import modalStyle from '@/container/common/modal.module.scss';

function Header({ isSidebarExpanded, onHamburgerMenuClick }) {
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
};

Header.defaultProps = {
  isSidebarExpanded: false,
  onHamburgerMenuClick: () => {},
};

export default Header;
