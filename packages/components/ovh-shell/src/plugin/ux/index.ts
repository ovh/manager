import { ShellUX } from './ux';
import Shell from '../../shell/shell';

export interface IUXPlugin {
  registerSidebar(sidebarName: string): void;
  isSidebarVisible(sidebarName: string): boolean;
  showSidebar(sidebarName: string): void;
  hideSidebar(sidebarName: string): void;
  toggleSidebarVisibility(sidebarName: string): void;
  registerNavbar(): void;
}

// TODO: remove this once we have a more generic Plugin class
export type UXPluginType<T extends IUXPlugin> = {
  [key in keyof T]?: T[key];
};

export class UXPlugin implements IUXPlugin {
  private shellUX: ShellUX;

  private shell: Shell;

  constructor(shell: Shell) {
    this.shellUX = new ShellUX();
    this.shell = shell;
  }

  public registerSidebar(sidebarName: string): void {
    this.shellUX.registerSidebar(sidebarName);
    this.shell.emitEvent('ux:sidebar-register', { sidebarName });
  }

  isSidebarVisible(sidebarName: string): boolean {
    return this.shellUX.isSidebarVisible(sidebarName);
  }

  showSidebar(sidebarName: string): void {
    this.shellUX.showSidebar(sidebarName);
    this.shell.emitEvent('ux:sidebar-show', { sidebarName });
  }

  hideSidebar(sidebarName: string): void {
    this.shellUX.hideSidebar(sidebarName);
    this.shell.emitEvent('ux:sidebar-hide', { sidebarName });
  }

  toggleSidebarVisibility(sidebarName: string): void {
    this.shellUX.toggleSidebarVisibility(sidebarName);
    const sidebarVisible = this.shellUX.isSidebarVisible(sidebarName);
    if (sidebarVisible) {
      this.shell.emitEvent('ux:sidebar-show', { sidebarName });
    } else {
      this.shell.emitEvent('ux:sidebar-hide', { sidebarName });
    }
  }

  registerNavbar(): void {
    this.shellUX.registerNavbar();
    this.shell.emitEvent('ux:navbar-register', {});
  }
}
