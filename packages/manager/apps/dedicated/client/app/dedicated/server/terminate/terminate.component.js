import controller from './dedicated-server-terminate.controller';
import template from './dedicated-server-terminate.html';

export default {
  bindings: {
    goBack: '<',
    server: '<',
    resiliationCapability: '<',
    serviceInfos: '<',
  },
  controllerAs: 'ctrl',
  controller,
  template,
};
