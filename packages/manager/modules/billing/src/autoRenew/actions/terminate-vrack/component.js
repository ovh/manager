import template from './template.html';
import controller from './controller';

export default {
  bindings: {
    goBack: '<',
    service: '<',
    serviceType: '<',
  },
  controller,
  template,
  name: 'billingAutorenewTerminateVrack',
};
