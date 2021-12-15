import { set } from 'lodash-es';

import useSidebar from './useSidebar';
import useNavbar from './useNavbar';

const useUx = () => {
  const sidebars = {};
  let navbar = null;

  /* ----------  Sidebar  ---------- */

  const registerSidebar = (sidebarName, options = {}) => {
    set(sidebars, sidebarName, useSidebar(options));
  };

  const getSidebar = (sidebarName) => {
    return sidebars[sidebarName];
  };

  const toggleSidebar = (sidebarName) => {
    const { toggleIsOpenState } = getSidebar(sidebarName);
    toggleIsOpenState();
  };

  const isSidebarOpen = (sidebarName) => {
    return getSidebar(sidebarName).isOpen;
  };

  /* ----------  Navbar  ---------- */

  const registerNavbar = (options = {}) => {
    navbar = useNavbar(options);
  };

  const getNavbarNotificationCount = () => {
    return navbar.notificationCount;
  };

  const setNavbarNotificationCount = (count) => {
    navbar.setNotificationCount(count);
  };

  // init defaults
  registerSidebar('account', { isOpen: true });
  registerSidebar('notifications', { isOpen: false });
  registerNavbar();

  return {
    // expose sidebar methods and attributes
    sidebars,
    registerSidebar,
    isSidebarOpen,
    getSidebar,
    toggleSidebar,
    // expose navbar methods and attributes
    navbar,
    registerNavbar,
    getNavbarNotificationCount,
    setNavbarNotificationCount,
  };
};

export default useUx;
