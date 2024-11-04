import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    service: '<',
    serviceType: '<',
    isEmpty: '<',
  },
  controller,
  template,
  name: 'billingAutorenewTerminateVrack',
};
