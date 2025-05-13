import template from './information.html';

export default {
  bindings: {
    actions: '<',
    regionsGroup: '<',
    vps: '<',
    vpsState: '<',
    goToKvm: '<',
    goToReboot: '<',
    goToRebootRescue: '<',
    goToReinstall: '<',
    isMigrating: '<',
  },
  template,
};
