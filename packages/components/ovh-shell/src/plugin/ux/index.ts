import shellUx from './ux';
import Shell from '../../shell/shell';

export function ux(shell: Shell) {
  const uxPlugin = shellUx();

  return {
    // sidebar
    registerSidebar: (sidebarName: string): void => {
      uxPlugin.registerSidebar(sidebarName);
      shell.emitEvent('ux:sidebar-register', { sidebarName });
    },
    isSidebarVisible: (sidebarName: string): boolean =>
      uxPlugin.isSidebarVisible(sidebarName),
    showSidebar: (sidebarName: string): void => {
      uxPlugin.showSidebar(sidebarName);
      shell.emitEvent('ux:sidebar-show', { sidebarName });
    },
    hideSidebar: (sidebarName: string): void => {
      uxPlugin.hideSidebar(sidebarName);
      shell.emitEvent('ux:sidebar-hide', { sidebarName });
    },
    toggleSidebarVisibility: (sidebarName: string): void => {
      uxPlugin.toggleSidebarVisibility(sidebarName);
      const sidebarVisible = uxPlugin.isSidebarVisible(sidebarName);
      if (sidebarVisible) {
        shell.emitEvent('ux:sidebar-show', { sidebarName });
      } else {
        shell.emitEvent('ux:sidebar-hide', { sidebarName });
      }
    },
    // navbar
    registerNavbar: (): void => {
      uxPlugin.registerNavbar();
      shell.emitEvent('ux:navbar-register', {});
    },
  };
}

export default ux;
