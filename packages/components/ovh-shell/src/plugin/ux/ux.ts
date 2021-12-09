import Sidebar from './components/sidebar';
import Navbar, { INavbar } from './components/navbar';

export interface ISidebars {
  [name: string]: Sidebar;
}

interface IShellUx {
  registerSidebar: (name: string) => void;
  isSidebarVisible: (name: string) => boolean;
  toggleSidebarVisibility: (name: string) => void;
  showSidebar: (name: string) => void;
  hideSidebar: (name: string) => void;
  registerNavbar: () => void;
  getNavbar: () => INavbar;
  getSidebars: () => ISidebars;
}

export class ShellUX implements IShellUx {
  private navbar: INavbar;

  private sidebars: ISidebars = {};

  registerSidebar(name: string): void {
    this.sidebars[name] = new Sidebar();
  }

  isSidebarVisible(name: string): boolean {
    return this.sidebars[name]?.getVisibility() || false;
  }

  getSidebars(): ISidebars {
    return this.sidebars;
  }

  toggleSidebarVisibility(name: string): void {
    const registeredSidebar = this.sidebars[name];

    if (registeredSidebar?.isToggleAllowed()) {
      registeredSidebar.toggleVisibility();
    }
  }

  showSidebar(name: string): void {
    const registeredSidebar = this.sidebars[name];

    registeredSidebar?.show();
  }

  hideSidebar(name: string): void {
    const registeredSidebar = this.sidebars[name];

    registeredSidebar?.hide();
  }

  registerNavbar(): void {
    this.navbar = Navbar();
  }

  getNavbar(): INavbar {
    return this.navbar;
  }
}
