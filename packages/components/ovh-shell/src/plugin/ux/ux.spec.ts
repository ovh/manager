import { ShellUX } from '../../../src/plugin/ux/ux';
import DirectClientMessageBus from '../../../src/message-bus/direct-client';
import Shell from '../../../src/shell/shell';
import { vi } from 'vitest';

describe('test for ux plugin', () => {
  const shellMessageBus = new DirectClientMessageBus();
  const shell = new Shell();
  shell.setMessageBus(shellMessageBus);
  let uxPlugin: ShellUX;

  uxPlugin = new ShellUX(shell);
  uxPlugin.registerSidebar('foo');
  uxPlugin.hideSidebar('foo');

  it('Toggle the visibility of a ux component', () => {
    uxPlugin.toggleSidebarVisibility('foo');
    expect(uxPlugin.isSidebarVisible('foo')).toBe(true);
  });

  it('Toggle the visibility of sidebar when toggle is disabled', () => {
    const uxShell = new ShellUX(shell);
    uxShell.registerSidebar('foo');
    uxShell.showSidebar('foo');
    uxShell.disableSidebarToggle('foo');
    uxShell.toggleSidebarVisibility('foo');
    expect(uxShell.isSidebarVisible('foo')).toBe(true);
  });

  it('Trigger custom action when visibility of sidebar changes', () => {
    const uxShell = new ShellUX(shell);
    uxShell.registerSidebar('foo');
    uxShell.showSidebar('foo');
    const customAction = vi.fn(() => 'action');
    uxShell.onSidebarVisibilityChange('foo', customAction);
    uxShell.toggleSidebarVisibility('foo');
    expect(customAction).toHaveBeenCalled();
  });
});
