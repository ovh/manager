import Shell from '../../shell/shell';
import Sidebar from './components/sidebar';
import Navbar, { INavbar } from './components/navbar';
import Chatbot from './components/chatbot';
import Progress from './components/progress';
import Preloader from './components/preloader';

export interface ISidebars {
  [name: string]: Sidebar;
}

interface IShellUx {
  registerSidebar: (sidebarName: string) => void;
  isSidebarVisible: (sidebarName: string) => boolean;
  toggleSidebarVisibility: (sidebarName: string) => void;
  showSidebar: (sidebarName: string) => void;
  hideSidebar: (sidebarName: string) => void;
  registerNavbar: () => void;
  registerProgress: () => void;
  onSidebarVisibilityChange(
    sidebarName: string,
    callback: CallableFunction,
  ): void;
}

export class ShellUX implements IShellUx {
  private shell: Shell;

  private navbar: INavbar;

  private sidebars: ISidebars = {};

  private chatbot: Chatbot;

  private progress: Progress;

  private preloader: Preloader;

  constructor(shell: Shell) {
    this.shell = shell;
    this.chatbot = new Chatbot();
  }

  registerSidebar(sidebarName: string): void {
    this.sidebars[sidebarName] = new Sidebar();
    this.shell.emitEvent('ux:sidebar-register', { sidebarName });
  }

  isSidebarVisible(sidebarName: string): boolean {
    return this.sidebars[sidebarName]?.getVisibility() || false;
  }

  toggleSidebarVisibility(sidebarName: string): void {
    const registeredSidebar = this.sidebars[sidebarName];

    if (registeredSidebar?.isToggleAllowed()) {
      registeredSidebar.toggleVisibility();
      if (this.isSidebarVisible(sidebarName)) {
        this.shell.emitEvent('ux:sidebar-show', { sidebarName });
      } else {
        this.shell.emitEvent('ux:sidebar-hide', { sidebarName });
      }
    }
  }

  enableSidebarToggle(sidebarName: string): void {
    const registeredSidebar = this.sidebars[sidebarName];

    registeredSidebar?.enableToggle();
  }

  disableSidebarToggle(sidebarName: string): void {
    const registeredSidebar = this.sidebars[sidebarName];

    registeredSidebar?.disableToggle();
  }

  isLargeScreenDisplayForced(sidebarName: string): boolean {
    const registeredSidebar = this.sidebars[sidebarName];

    return registeredSidebar?.isLargeScreenDisplayForced();
  }

  setForceSiderBarDisplayOnLargeScreen(
    sidebarName: string,
    isForced: boolean,
  ): void {
    const registeredSidebar = this.sidebars[sidebarName];

    registeredSidebar?.setForceLargeScreenDisplay(isForced);
  }

  onSidebarVisibilityChange(
    sidebarName: string,
    callback: CallableFunction,
  ): void {
    this.sidebars[sidebarName]?.onSidebarVisibilityChange(callback);
  }

  showSidebar(sidebarName: string): void {
    const registeredSidebar = this.sidebars[sidebarName];

    if (registeredSidebar) {
      registeredSidebar.show();
      this.shell.emitEvent('ux:sidebar-show', { sidebarName });
    }
  }

  hideSidebar(sidebarName: string): void {
    const registeredSidebar = this.sidebars[sidebarName];

    if (registeredSidebar) {
      registeredSidebar.hide();
      this.shell.emitEvent('ux:sidebar-hide', { sidebarName });
    }
  }

  resetSidebar(sidebarName: string) {
    const registeredSidebar = this.sidebars[sidebarName];
    if (registeredSidebar) {
      registeredSidebar.reset();
    }
  }

  registerNavbar(): void {
    this.navbar = Navbar();
    this.shell.emitEvent('ux:navbar-register', {});
  }

  getNavbar(): INavbar {
    return this.navbar;
  }

  getChatbot(): Chatbot {
    return this.chatbot;
  }

  registerProgress(): void {
    this.progress = new Progress();
  }

  startProgress() {
    this.progress.start();
  }

  stopProgress() {
    this.progress.stop();
  }

  onProgressStart(callback: CallableFunction) {
    this.progress.onStart(callback);
  }

  onProgressStop(callback: CallableFunction) {
    this.progress.onStop(callback);
  }

  registerPreloader(): void {
    this.preloader = new Preloader();
  }

  showPreloader(): void {
    this.preloader.show();
  }

  onShowPreloader(callback: CallableFunction) {
    this.preloader.onShow(callback);
  }

  removeOnShowPreloader(callback: CallableFunction) {
    this.preloader.removeOnSHow(callback);
  }

  hidePrelaoder(): void {
    this.preloader.hide();
  }

  onHidePreloader(callback: CallableFunction) {
    this.preloader.onHide(callback);
  }

  removeOnHidePreloader(callback: CallableFunction) {
    this.preloader.removeOnHide(callback);
  }

  openChatbot() {
    this.chatbot.show();
  }

  closeChatbot() {
    this.chatbot.hide();
  }

  onChatbotVisibilityChange(callback: CallableFunction) {
    this.chatbot.onVisibilityChange(callback);
  }
}
