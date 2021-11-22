import Sidebar, { ISidebar } from './components/sidebar';
import Navbar, { INavbar } from './components/navbar';

export interface ISidebars {
  [name: string]: ISidebar;
}

export interface IShellUx {
  registerSidebar: CallableFunction;
  isSidebarVisible: CallableFunction;
  toggleSidebarVisibility: CallableFunction;
  showSidebar: CallableFunction;
  hideSidebar: CallableFunction;
  registerNavbar: CallableFunction;
  getNavbar: CallableFunction;
}

const shellUx = (): IShellUx => {
  const sidebars: ISidebars = {};
  let navbar: INavbar;

  const registerSidebar = (name: string) => {
    sidebars[name] = Sidebar();
  };

  const isSidebarVisible = (name: string): boolean => {
    return sidebars[name]?.getVisibility() || false;
  };

  const toggleSidebarVisibility = (name: string) => {
    const registeredSidebar = sidebars[name];

    if (registeredSidebar) {
      registeredSidebar.toggleVisibility();
    }
  };

  const showSidebar = (name: string) => {
    const registeredSidebar = sidebars[name];

    if (registeredSidebar) {
      registeredSidebar.show();
    }
  };

  const hideSidebar = (name: string) => {
    const registeredSidebar = sidebars[name];

    if (registeredSidebar) {
      registeredSidebar.hide();
    }
  };

  const registerNavbar = () => {
    navbar = Navbar();
  };

  const getNavbar = (): INavbar => {
    return navbar;
  };

  return {
    registerSidebar,
    isSidebarVisible,
    toggleSidebarVisibility,
    showSidebar,
    hideSidebar,
    registerNavbar,
    getNavbar,
  };
};

export default shellUx;
