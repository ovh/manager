import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    possibleActions: '<',
    onPowerOn: '&',
    onPowerOff: '&',
    onInstall: '&',
    onReinstall: '&',
    onUninstall: '&',
    onTerminate: '&',
  },
  template,
  controller,
};
