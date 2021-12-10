import Shell from '../../shell/shell';
import { ShellUX } from './ux';

export interface IUXPlugin {
  isAccountSidebarVisible(sidebarName: string): boolean;
  showAccountSidebar(sidebarName: string): void;
  hideAccountSidebar(sidebarName: string): void;
  toggleAccountSidebarVisibility(sidebarName: string): void;
  isNotificationsSidebarVisible(sidebarName: string): boolean;
  showNotificationsSidebar(sidebarName: string): void;
  hideNotificationsSidebar(sidebarName: string): void;
  toggleNotificationsSidebarVisibility(sidebarName: string): void;
}

// TODO: remove this once we have a more generic Plugin class
export type UXPluginType<T extends IUXPlugin> = {
  [key in keyof T]?: T[key];
};

export class UXPlugin implements IUXPlugin {
  private shellUX: ShellUX;

  constructor(shell: Shell) {
    this.shellUX = new ShellUX(shell);

    this.shellUX.registerSidebar('account');
    this.shellUX.registerSidebar('notifications');
    this.shellUX.registerNavbar();
  }

  /* ----------- AccountSidebar methods -----------*/

  isAccountSidebarVisible(): boolean {
    return this.shellUX.isSidebarVisible('account');
  }

  showAccountSidebar(): void {
    return this.shellUX.showSidebar('account');
  }

  hideAccountSidebar(): void {
    return this.shellUX.hideSidebar('account');
  }

  toggleAccountSidebarVisibility(): void {
    this.shellUX.toggleSidebarVisibility('account');
  }

  /* ----------- NotificationsSidebar methods -----------*/

  isNotificationsSidebarVisible(): boolean {
    return this.shellUX.isSidebarVisible('notifications');
  }

  showNotificationsSidebar(): void {
    return this.shellUX.showSidebar('notifications');
  }

  hideNotificationsSidebar(): void {
    return this.shellUX.hideSidebar('notifications');
  }

  toggleNotificationsSidebarVisibility(): void {
    this.shellUX.toggleSidebarVisibility('notifications');
  }
}
