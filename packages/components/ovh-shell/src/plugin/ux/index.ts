import Shell from '../../shell/shell';
import { ShellUX } from './ux';

export interface IUXPlugin {
  isAccountSidebarVisible(): boolean;
  isMenuSidebarVisible(): boolean;
  showAccountSidebar(disableToggle: boolean): void;
  showMenuSidebar(): void;
  updateMenuSidebarItemLabel(serviceName: string, label: string): void;
  onUpdateMenuSidebarItemLabel(callback: CallableFunction): void;
  hideAccountSidebar(): void;
  hideMenuSidebar(): void;
  isNotificationsSidebarVisible(): boolean;
  showNotificationsSidebar(): void;
  hideNotificationsSidebar(): void;
  setForceAccountSiderBarDisplayOnLargeScreen(isForced: boolean): void;
  resetAccountSidebar(): void;
  toggleNotificationsSidebarVisibility(): void;
  toggleAccountSidebarVisibility(): void;
  getUserIdCookie(): string;
  registerModalActionDoneListener(callback: (id: string) => void): void;
  unregisterModalActionDoneListener(callback: (id: string) => void): void;
  notifyModalActionDone(id: string): void;
}

// TODO: remove this once we have a more generic Plugin class
export type UXPluginType<T extends UXPlugin> = {
  [key in keyof T]?: T[key];
};

export class UXPlugin implements IUXPlugin {
  private shell: Shell;

  private shellUX: ShellUX;

  private sidebarMenuUpdateItemLabelListener?: CallableFunction;

  private onModalActionDone?: (id: string) => void;

  constructor(shell: Shell) {
    this.shell = shell;

    this.shellUX = new ShellUX(this.shell);
    this.shellUX.registerSidebar('account');
    this.shellUX.registerSidebar('notifications');
    this.shellUX.registerSidebar('menu');
    this.shellUX.registerProgress();
    this.shellUX.registerPreloader();
  }

  /* ----------- AccountSidebar methods -----------*/

  isAccountSidebarVisible(): boolean {
    return this.shellUX.isSidebarVisible('account');
  }

  isAccountSidebarLargeScreenDisplayForced(): boolean {
    return this.shellUX.isLargeScreenDisplayForced('account');
  }

  showAccountSidebar(): void {
    return this.shellUX.showSidebar('account');
  }

  isMenuSidebarVisible(): boolean {
    return this.shellUX.isSidebarVisible('menu');
  }

  showMenuSidebar(): void {
    return this.shellUX.showSidebar('menu');
  }

  hideAccountSidebar(): void {
    return this.shellUX.hideSidebar('account');
  }

  hideMenuSidebar(): void {
    return this.shellUX.hideSidebar('menu');
  }

  onUpdateMenuSidebarItemLabel(callback: CallableFunction) {
    this.sidebarMenuUpdateItemLabelListener = callback;
  }

  updateMenuSidebarItemLabel(serviceName: string, label: string): void {
    if (this.sidebarMenuUpdateItemLabelListener) {
      this.sidebarMenuUpdateItemLabelListener(serviceName, label);
    }
  }

  setForceAccountSiderBarDisplayOnLargeScreen(isForced: boolean): void {
    this.shellUX.setForceSiderBarDisplayOnLargeScreen('account', isForced);
  }

  resetAccountSidebar(): void {
    this.shellUX.resetSidebar('account');
  }

  toggleAccountSidebarVisibility(): void {
    this.shellUX.toggleSidebarVisibility('account');
  }

  onAccountSidebarVisibilityChange(callback: CallableFunction): void {
    this.shellUX.onSidebarVisibilityChange('account', callback);
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

  onNotificationsSidebarVisibilityChange(callback: CallableFunction): void {
    this.shellUX.onSidebarVisibilityChange('notifications', callback);
  }

  /* ----------- SSOAuthModal methods -----------*/

  getUserIdCookie = () => {
    const latestCookies = document.cookie;
    const userIdCookie = latestCookies
      .split(';')
      .find((item) => item.includes('USERID'));

    if (userIdCookie) {
      return userIdCookie.split('=')[1];
    }

    return '';
  };

  getSSOAuthModalMode(oldUserID: string): string {
    const latestUserIdCookie = this.getUserIdCookie();

    if (oldUserID && !latestUserIdCookie) {
      // from connected to disconnected
      return 'CONNECTED_TO_DISCONNECTED';
    }

    if (!oldUserID && latestUserIdCookie) {
      // from disconnected to connected
      return 'DISCONNECTED_TO_CONNECTED';
    }

    if (oldUserID !== latestUserIdCookie) {
      // from connected to connected with other
      return 'CONNECTED_TO_OTHER';
    }

    return '';
  }

  /* ----------- Chatbot methods -----------*/

  isChatbotReduced(): boolean {
    return this.shellUX.getChatbot().isReduced();
  }

  isChatbotVisible(): boolean {
    return this.shellUX.getChatbot().getVisibility();
  }

  openLiveChat(): void {
    this.shellUX.openChatbot();
  }

  closeChatbot(): void {
    this.shellUX.closeChatbot();
  }

  reduceChatbot(): void {
    this.shell.emitEvent('ux:reduce-chatbot');
  }

  onChatbotVisibilityChange(callback: CallableFunction): void {
    this.shellUX.getChatbot().onVisibilityChange(callback);
  }

  startProgress(): void {
    this.shellUX.startProgress();
  }

  stopProgress(): void {
    this.shellUX.stopProgress();
  }

  onProgressStart(callback: CallableFunction): void {
    this.shellUX.onProgressStart(callback);
  }

  onProgressStop(callback: CallableFunction): void {
    this.shellUX.onProgressStop(callback);
  }

  showPreloader(): void {
    this.shellUX.showPreloader();
  }

  onShowPreloader(callback: CallableFunction): void {
    this.shellUX.onShowPreloader(callback);
  }

  removeOnShowPreloader(callback: CallableFunction): void {
    this.shellUX.removeOnShowPreloader(callback);
  }

  hidePreloader(): void {
    this.shellUX.hidePrelaoder();
  }

  onHidePreloader(callback: CallableFunction): void {
    this.shellUX.onHidePreloader(callback);
  }

  removeOnHidePreloader(callback: CallableFunction): void {
    this.shellUX.removeOnHidePreloader(callback);
  }

  // request the client application to open his sidebar
  requestClientSidebarOpen() {
    this.shell.emitEvent('ux:client-sidebar-open');
  }

  /* ----------- Modal action methods -----------*/
  registerModalActionDoneListener(callback: (id: string) => void) {
    this.onModalActionDone = callback;
  }

  unregisterModalActionDoneListener(callback: (id: string) => void) {
    if (this.onModalActionDone === callback) {
      this.onModalActionDone = undefined;
    }
  }

  notifyModalActionDone(id: string) {
    if (this.onModalActionDone) {
      this.onModalActionDone(id);
    }
  }
}
