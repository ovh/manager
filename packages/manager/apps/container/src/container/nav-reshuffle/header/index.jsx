import React, { useState, Suspense } from 'react';
import PropTypes from 'prop-types';
import Notifications from '@/container/common/notifications-sidebar/notifications-button';
import NotificationsSidebar from '@/container/common/notifications-sidebar';
import LanguageMenu from '@/container/common/language';
import { NotificationsProvider } from '@/core/notifications';
import ApplicationContext, { useShell } from '@/context';
import HamburgerMenu from './hamburger-menu';

function Header({ isSidebarExpanded, onHamburgerMenuClick }) {
  const shell = useShell();
  const [userLocale, setUserLocale] = useState(
    shell.getPlugin('i18n').getLocale(),
  );

  return (
    <ApplicationContext.Consumer>
      {({ environment }) => (
        <Suspense fallback="">
          <div className="oui-navbar">
            <HamburgerMenu
              isOpen={isSidebarExpanded}
              onClick={onHamburgerMenuClick}
            />
            <div className="oui-navbar-list oui-navbar-list_aside oui-navbar-list_end">
              <div className="oui-navbar-list__item">
                <LanguageMenu
                  setUserLocale={setUserLocale}
                  userLocale={userLocale}
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
