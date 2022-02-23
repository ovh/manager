import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goToOrderHost: '<',
    goToReinstallHost: '<',
    goToRemoveHost: '<',
    goToRestartHost: '<',
    goToSetStateHost: '<',
    serviceName: '<',
    trackClick: '<',
    hostHitTracking: '<',
    availableOptions: '<',
    packInfo: '<',
  },
  controller,
  template,
};
