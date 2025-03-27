import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    serviceName: '<',
    server: '<',
    hasOnlyMinimumNode: '<',
    initialCommitmentSize: '<',
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
