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

  const [isAccountSidebarVisible, setIsAccountSidebarVisible] = useState(
    uxPlugin.isAccountSidebarVisible(),
  );

  const [
    isAccountSidebarLargeScreenDisplayForced,
    setIsAccountSidebarLargeScreenDisplayForced,
  ] = useState(uxPlugin.isAccountSidebarLargeScreenDisplayForced());

  useEffect(() => {
    uxPlugin.onAccountSidebarVisibilityChange(() => {
      setIsAccountSidebarLargeScreenDisplayForced(
        uxPlugin.isAccountSidebarLargeScreenDisplayForced(),
      );
      setIsAccountSidebarVisible(uxPlugin.isAccountSidebarVisible());
    });
  }, []);

  /* ----------- Notifications sidebar -----------*/

  const [
    isNotificationsSidebarVisible,
    setIsNotificationsSidebarVisible,
  ] = useState(uxPlugin.isNotificationsSidebarVisible());

  const headerContext = {
    isAccountSidebarVisible,
    isAccountSidebarLargeScreenDisplayForced,
    setIsAccountSidebarVisible,
    isNotificationsSidebarVisible,
    setIsNotificationsSidebarVisible,
  };

  useEffect(() => {
    uxPlugin.onNotificationsSidebarVisibilityChange(() => {
      setIsNotificationsSidebarVisible(
        uxPlugin.isNotificationsSidebarVisible(),
      );
    });
  }, []);

  return (
    <HeaderContext.Provider value={headerContext}>
      {children}
    </HeaderContext.Provider>
  );
};

export default HeaderProvider;
