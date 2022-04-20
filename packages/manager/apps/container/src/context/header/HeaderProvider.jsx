import React, { useState, useEffect } from 'react';
import { useShell } from '@/context';

import HeaderContext from './header.context';

export const HeaderProvider = ({ children }) => {
  const shell = useShell();
  const uxPlugin = shell.getPlugin('ux');

  /* ----------- Account sidebar -----------*/

  const [
    isAccountSidebarVisible,
    setIsAccountSidebarVisible,
  ] = useState(uxPlugin.isAccountSidebarVisible());
  const isAccountSidebarLargeScreenDisplayForced = uxPlugin.isAccountSidebarLargeScreenDisplayForced();

  useEffect(() => {
    uxPlugin.onAccountSidebarVisibilityChange(() => {
      setIsAccountSidebarVisible(uxPlugin.isAccountSidebarVisible());
    });
  }, []);

  function toggleAccountSidebar() {
    uxPlugin.toggleAccountSidebarVisibility();
  }

  /* ----------- Notifications sidebar -----------*/

  const [
    isNotificationsSidebarVisible,
    setIsNotificationsSidebarVisible,
  ] = useState(uxPlugin.isNotificationsSidebarVisible());

  useEffect(() => {
    uxPlugin.onNotificationsSidebarVisibilityChange(() => {
      setIsNotificationsSidebarVisible(uxPlugin.isNotificationsSidebarVisible());
    });
  }, []);

  function toggleNotificationSidebar() {
    uxPlugin.toggleNotificationsSidebarVisibility();
  }

  return (
    <HeaderContext.Provider
      value={{
        isAccountSidebarLargeScreenDisplayForced,
        isAccountSidebarVisible,
        isNotificationsSidebarVisible,
        toggleAccountSidebar,
        toggleNotificationSidebar,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export default HeaderProvider;
