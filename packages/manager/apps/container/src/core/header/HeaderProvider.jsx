import React, { useContext, useEffect, useState } from 'react';

import HeaderContext from './header.context';
import { useShell } from '@/context';

export const HeaderProvider = ({ children }) => {
  let headerContext = useContext(HeaderContext);
  const uxPlugin = useShell().getPlugin('ux');

  /* ----------- Account sidebar -----------*/

  const [isAccountSidebarVisible, setIsAccountSidebarVisible] = useState(
    uxPlugin.isAccountSidebarVisible(),
  );

  useEffect(() => {
    uxPlugin.toggleAccountSidebarVisibility();
  }, [isAccountSidebarVisible]);

  /* ----------- Notifications sidebar -----------*/

  const [
    isNotificationsSidebarVisible,
    setIsNotificationsSidebarVisible,
  ] = useState(uxPlugin.isNotificationsSidebarVisible());

  useEffect(() => {
    uxPlugin.toggleNotificationsSidebarVisibility();
  }, [isNotificationsSidebarVisible]);

  headerContext = {
    // account sidebar
    isAccountSidebarVisible,
    setIsAccountSidebarVisible,
    // notifications sidebar
    isNotificationsSidebarVisible,
    setIsNotificationsSidebarVisible,
  };

  return (
    <HeaderContext.Provider value={headerContext}>
      {children}
    </HeaderContext.Provider>
  );
};

export default HeaderProvider;
