import template from './template.html';

export default {
  bindings: {
    goToOrderHost: '<',
    goToReinstallHost: '<',
    goToRemoveHost: '<',
    goToRestartHost: '<',
    goToSetStateHost: '<',
    serviceName: '<',
  },
  template,
};
