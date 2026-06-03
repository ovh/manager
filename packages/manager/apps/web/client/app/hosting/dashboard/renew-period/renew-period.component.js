import template from './renew-period.html';
import controller from './renew-period.controller';

export default {
  bindings: {
    goBack: '<',
    serviceId: '<',
    serviceName: '<',
  },
  template,
  controller,
};
