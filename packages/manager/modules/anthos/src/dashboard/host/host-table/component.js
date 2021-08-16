import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    additionalHosts: '<',
    goToReinstallHost: '<',
    goToRestartHost: '<',
    goToSetStateHost: '<',
  },
  controller,
  template,
};
