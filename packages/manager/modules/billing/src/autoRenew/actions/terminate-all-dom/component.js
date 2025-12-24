import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    goToAutorenew: '<',
    domains: '<',
    serviceType: '<',
    serviceId: '<',
  },
  controller,
  template,
};
