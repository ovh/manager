import React, { useState, useEffect } from 'react';
import { useShell } from '@/context';

import HeaderContext from './header.context';

export const HeaderProvider = ({ children }) => {
  const shell = useShell();
  const uxPlugin = shell.getPlugin('ux');
  /* ----------- Account sidebar -----------*/
  const [isAccountSidebarVisible, setIsAccountSidebarVisible] = useState(false);

  /* ----------- Notifications sidebar -----------*/

  const [
    isNotificationsSidebarVisible,
    setIsNotificationsSidebarVisible,
  ] = useState(false);

  const headerContext = {
    // Account sidebar
    isAccountSidebarVisible,
    setIsAccountSidebarVisible,
    // Notifications sidebar
    isNotificationsSidebarVisible,
    setIsNotificationsSidebarVisible,
  };

  useEffect(() => {
    setIsNotificationsSidebarVisible(uxPlugin.isNotificationsSidebarVisible());
    uxPlugin.onAccountSidebarVisibilityChange(() => {
      setIsAccountSidebarVisible(uxPlugin?.isAccountSidebarVisible());
    });
  }, []);

  useEffect(() => {
    uxPlugin.toggleNotificationsSidebarVisibility();
  }, [isNotificationsSidebarVisible]);

  return (
    <HeaderContext.Provider value={headerContext}>
      {children}
    </HeaderContext.Provider>
  );
};

export default HeaderProvider;
