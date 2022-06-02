import { createContext } from 'react';

export type HeaderContextType = {
  isAccountSidebarVisible: boolean;
  isAccountSidebarLargeScreenDisplayForced: boolean;
  setIsAccountSidebarVisible(isVisible: boolean): void;
  isNotificationsSidebarVisible: boolean;
  setIsNotificationsSidebarVisible(isVisible: boolean): void;
};

const HeaderContext = createContext<HeaderContextType>({} as HeaderContextType);

export default HeaderContext;
