import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goBack: '<',
    domains: '<',
    serviceType: '<',
    serviceId: '<',
  },
  controller,
  template,
};
