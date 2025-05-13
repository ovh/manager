import controller from './service-status-action.controller';
import template from './service-status-action.html';

export default {
  bindings: {
    serviceInfos: '<',
    serviceName: '<',
    serviceType: '<',
    domainState: '<',
  },
  controller,
  template,
};
