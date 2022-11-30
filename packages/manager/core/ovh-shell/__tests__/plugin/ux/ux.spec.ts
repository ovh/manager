import { loadFeature, defineFeature, DefineStepFunction } from 'jest-cucumber';
import { ShellUX } from '../../../src/plugin/ux/ux';
import DirectClientMessageBus from '../../../src/message-bus/direct-client';
import Shell from '../../../src/shell/shell';

const feature = loadFeature('../../../features/plugin/ux/ux.feature', {
  loadRelativePath: true,
});

defineFeature(feature, (test) => {
  const shellMessageBus = new DirectClientMessageBus();
  const shell = new Shell();
  shell.setMessageBus(shellMessageBus);
  let uxPlugin: ShellUX;

  // define ux instanciation
  const givenUxPluginInstanciated = (given: DefineStepFunction) => {
    given('I have a ux plugin instanciated with a registered sidebar', () => {
      uxPlugin = new ShellUX(shell);
      uxPlugin.registerSidebar('foo');
      uxPlugin.hideSidebar('foo');
    });
  };

  test('Toggle the visibility of a ux component', ({ given, when, then }) => {
    givenUxPluginInstanciated(given);

    when('I toggle the visibility of the sidebar', () => {
      uxPlugin.toggleSidebarVisibility('foo');
    });

    then('I should see the sidebar', () => {
      expect(uxPlugin.isSidebarVisible('foo')).toBe(true);
    });
  });

  test('Toggle the visibility of sidebar when toggle is disabled', ({given, and, when, then}) => {
    const uxShell = new ShellUX(shell);
    uxShell.registerSidebar('foo');

    given('I have a sidebar visible', () => {
      uxShell.showSidebar('foo');
    });

    and('My sidebar is not allowed to be toggled', () => {
      uxShell.disableSidebarToggle('foo');
    });

    when('I try to change the visibility', () => {
      uxShell.toggleSidebarVisibility('foo');
    });

    then('My sidebar should still be visible', () => {
      expect(uxShell.isSidebarVisible('foo')).toBe(true);
    })
  })

  test('Trigger custom action when visibility of sidebar changes', ({given, and, when, then}) => {
    let customAction;
    const uxShell = new ShellUX(shell);

    uxShell.registerSidebar('foo');

    given('I have a sidebar visible', () => {
      uxShell.showSidebar('foo');
    });

    and('A custom action', () => {
      customAction = jest.fn(() => 'action');
      uxShell.onSidebarVisibilityChange('foo', customAction);
    });

    when('I change sidebar visibility', () => {
      uxShell.toggleSidebarVisibility('foo');
    });

    then('My custom action should trigger', () => {
      expect(customAction).toHaveBeenCalled();
    });
  })
});
