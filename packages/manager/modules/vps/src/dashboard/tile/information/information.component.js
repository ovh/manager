import template from './information.html';

export default {
  bindings: {
    actions: '<',
    regionsGroup: '<',
    vps: '<',

    goToKvm: '<',
    goToReboot: '<',
    goToRebootRescue: '<',
  },
  template,
};
