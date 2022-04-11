import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import HeaderContext from './header.context';

import { useShell } from '@/context';

type Props = {
  children: JSX.Element;
};

export const HeaderProvider = ({ children }: Props): JSX.Element => {
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

HeaderProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

HeaderProvider.defaultProps = {
  children: null,
};

export default HeaderProvider;
