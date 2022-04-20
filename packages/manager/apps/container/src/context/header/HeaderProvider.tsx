import React, { useEffect, useState } from 'react';

import HeaderContext from './header.context';

import { useShell } from '@/context';

type Props = {
  children: JSX.Element;
};

export const HeaderProvider = ({ children = null }: Props): JSX.Element => {
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
